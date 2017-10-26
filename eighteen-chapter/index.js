// 单一职责原则 SRP
// 一个类而言，应该仅有一个引起它变化的原因
// SRP 原则体现为:一个对象(方法)只做一件事情

// SRP 原则在很多设计模式中都有着广泛的运用，例如代理模式、迭代器模式、单例模式和装 饰者模式。

//代理模式
// myImage 负责往页面中添加 img 标签:
var myImage = (function (){} {
	var imgNode = document.createElement('img');
	document.body.appendChild(imgNode)
	return {
		setSrc:function(src){
			imgNode.src = src;
		}
	}
})()

// proxyImage 负责预加载图片，并在预加载完成之后把请求交给本体 myImage
var proxyImage = (function(){
	var img =  new Image();
	img.onload = function(){
		myImage.setSrc(this.src)
	};
	return {
		setSrc:function(src){
			myImage.setSrc('xxx-loading.png');
			img.src = src;
		}
	}	
})()

proxyImage.setSrc('http://wwww.baidu/pic/cat.png');

//迭代器模式
var appendDiv = function(data){
	for(var i=0,l=data.length;i<l;i++){
		var div = document.createElement('div');
		div.innerHTML = data[i];
		document.body.appendChild(div)
	}
}

appendDiv([1,2,3,4,5,6]);

// appendDiv 函数本来只是负责渲染数据，但是在这里它还承担了遍历聚合对象 data 的职责

// 当把迭代聚合对象的职责单独封装在 each 函数中后
var each = function(obj,callback){
	var value ,i=0,length = obj.length,isArray = isArrayLike(obj);

	if(isArray){
		for(;i<length;i++){
			callback.call(obj[i],i,obj[i]);
		}
	}else {
		for(i in obj){
			value = callback.call(obj[i],i,obj[i]);
		}
	}

	return obj;
}

var appendDiv = function(data){
	each(data,function(i,n){
		var div = document.createElement('div');
		div.innerHTML = n;
		document.body.appendChild(div);
	})
}

appendDiv( [ 1, 2, 3, 4, 5, 6 ] ); 
appendDiv({a:1,b:2,c:3,d:4} );

//单例模式
//惰性单例
var createLoginLayer = (function(){
	var div;
	return function(){
		if(!div){
			div = document.createElement('div');
			div.innerHTML = '我是登录浮窗';
			div.style.display = 'none';
			document.body.appendChild(div)
		}
		return div;
	}
})()

// 把管理单例的职责和创建登录浮窗的职责分别封装在两个方法里，这两个方法可以 独立变化而互不影响
var getSingle = function(fn){
	var result;
	return function(){
		return result || (result = fn.apply(this,arguments))
	}
}

var createLoginLayer = function(){
	var div = document.createElement('div');
	div.innerHTML = '我是登录浮窗';
	document.body.appendChild(div)
	return div;
}

var createSingleLoginLayer = getSingle(createLoginLayer);
var loginLayer1 = createSingleLoginLayer();
var loginLayer2 = createSingleLoginLayer();
alert ( loginLayer1 === loginLayer2 );

// 装饰者模式
// 装饰者模式可以为对象动态增加职责，从另一个角度来看， 这也是分离职责的一种方式
Function.prototype.prototype.after = function(afterfn){
	var __self = this;
	return function(){
		var ret = __self.apply(this,arguments);
		afterfn.apply(this,arguments);
		return ret;
	}
};

var showLogin = function(){
	console.log('打开登录浮层')
}

var log = function(){
	console.log("上报标签为 xxx");
}

document.getElementById('button').onclick = showLogin.after(log);



// SRP 原则的应用难点就是如何去分离职责
// 一方面，如果随着需求的变化，有两个职责总是同时变化，那就不必分离他们
// 另一方面，职责的变化轴线仅当它们确定会发生变化时才具有意义
// SRP 原则的优点是降低了单个类或者对象的复杂度，按照职责把对象分解成更小的粒度， 
// 这有助于代码的复用，也有利于进行单元测试
// SRP 原则也有一些缺点，最明显的是会增加编写代码的复杂度
// 我们按照职责把对象 分解成更小的粒度之后，实际上也增大了这些对象之间相互联系的难度