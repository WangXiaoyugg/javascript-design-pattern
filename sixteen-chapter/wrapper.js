//适配器模式
//现实中的适配器，插头转化器，笔记本电源，usb转接口
// 适配器模式的应用
// 渲染地图为例
var googleMap = {
	show:() => {
		console.log('googleMap')
	}
}

var baiduMap = {
	show:() => {
		console.log('baiduMap')
	}
}

var renderMap = function (map) {
	if(map.show instanceof Function){
		map.show()
	}
}

renderMap(googleMap);
renderMap(baiduMap);

// baiduMap 提供的显示地图的方法不叫 show 而叫 display 呢
var baiduMap = {
	display:() => {
		console.log('baiduMap');
	}
}

var baiduMapAdapter = {
	show:function(){
		return baiduMap.display();
	}
}

renderMap(googleMap);
renderMap(baiduMap);

// 假设我们正在编写一个渲染广东省地图的页面。
// 目前从第三方资源 里获得了广东省的所有城市以及它们所对应的 ID
var getGuangDongCity = function(){
	var GuangDongCity = [
		{
			name:'shenzhen',
			id:11
		},
		{
			name:'guangzhou',
			id:12
		}
	]

	return GuangDongCity
}

var render = function(fn){
	console.log('render GuangDongCity map')
	document.write(JSON.stringify(fn()))
};

render(getGuangDongCity);

// 在网上找到了另外一些数据资源，这次的 数据更加全面,新的数据结构
var GuangDongCity = {
	shenzhen:11,
	guangzhou:12,
	zhuhai:13
}

var getGuangDongCity = function(){
	var GuangDongCity = [
		{
			name:'shenzhen',
			id:11
		},
		{
			name:'guangzhou',
			id:12
		}
	]

	return GuangDongCity;
}

var render = function(fn){
	console.log('render GuangDongCity map')
	document.write(JSON.stringify(fn()))
}

var addressAdapter = function(oldAddressfn){
	var address = {};
	var oldAddress = oldAddressfn();

	for(var i=0,c;c=oldAddress[i++]){
		address[c.name] = c.id;
	}

	return function(){
		return address;
	}
}

render(addressAdapter(getGuangDongCity));

// 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实 现的，也不考虑它们将来可能会如何演化