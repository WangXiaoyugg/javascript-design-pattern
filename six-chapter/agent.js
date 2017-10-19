var Flower = function (){}

var xiaoming = {
	sendFlower:function(target){
		var flower = new Flower()
		target.receiveFlower(flower)
	}
};

var B = {
	receiveFlower:function(flower){
		A.listenGoodMood(function(){
			A.receiveFlower(flower)
		})
	}
}
var A = {
	receiveFlower:function(flower){
		console.log('收到花' + flower)
	},
	listenGoodMood:function(fn){
		setTimeout(function(){
			fn();
		},1000 * 10)
	}
}

xiaoming.sendFlower(B);


//保护代理 用于控制不同权限的对象对目标对象的访问
//虚拟代理 虚拟代理是最常用的一种代理模式 把一些开销很大的对象，延迟到 真正需要它的时候才去创建
var B = {
	receiveFlower:function(flower){
		A.listenGoodMood(function(){
			var flower = new Flower();
			A.receiveFlower(flower);
		})
	}
}

//虚拟代理实现图片预加载
// var myImage = (function  () {
// 	var imgNode = document.createElement('img')
// 	document.body.appendChild(imgNode)

// 	return {
// 		setSrc:function(src){
// 			imgNode.src = src
// 		}
// 	}		 
// })()

// myImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg')

var myImage = (function(){
	var imgNode = document.createElement('img')
	document.body.appendChild(imgNode);

	return {
		setSrc: function(src){
			imgNode.src = src;
		}
	}
})()

var proxyImage = (function(){
	var img = new Image();
	img.onload = function(){
		myImage.setSrc(this.src)
	}

	return {
		setSrc:function(src){
			myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif')
			img.src = src;
		}
	}
})()

proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg')

//没有代理的图片预加载 违反单一职能原则和封闭-开放原则
var MyImage  = (function(){
	var imgNode = document.createElement('img')
	document.body.appendChild(imgNode);

	var img = new Image()
	img.onload = function(){
		imgNode.src = img.src;
	}
	return {
		setSrc:function  (src) {
			imgNode.src = 'file:// /C:/Users/svenzeng/Desktop/loading.gif'
			img.src = src
		}
	}
})()


//虚拟代理合并HTTP请求
var syncFile = function(id){
	console.log('开始同步文件， id为: ' + id);
}

var checkbox = document.getElementsByTagName('input')

for(var i=0,c; c = checkbox[i++];){
	c.onclick = function(){
		if(this.checked === true){
			syncFile(this.id)
		}
	}
}

//代理函数 proxySynchronousFile 来收集一段时间之内的请求， 最后一次性发送给服务器

var syncFile = function(id){
	console.log('开始同步文件， id为: ' + id);
}

var proxySyncFile = (function(){
	var cache = [] //数组保存一段时间内同步的id
	var timer = null ;

	return function(id){
		cache.push(id)
		if(timer){
			return ;
		}

		timer = setTimeout(function(){
			syncFile(cache.join(',')) //打印字符串
			clearTimeout(timer);
			timer = null;
			cache.length = 0 ; //清空id 集合
		}，2000)
	}
})()

var checkbox = document.getElementsByTagName('input');

for(var i=0,c;c=checkbox[i++];){
	c.onclick = function(){
		if(this.checked === true){
			proxySyncFile(this.id)
		}
	}
}

//为加载真正的 miniConsole.js 代码如下

var cache = []
var miniConsole = {
	log:function(){
		var args = arguments;
		cache.push(function(){
			return miniConsole.log.apply(miniConsole,args);
		})
	}
}

miniConsole.log(1);

//当用户按下F12时，开始加载真正的miniConsole.js 
var handler = function(ev){
	if(ev.keyCode === 113){
		var script = document.createElement('script')
		script.onload = function(){
			for(var i=0,fn;fn = cache[i++];){
				fn()
			}
		}

		script.src = 'miniConsole.js'
		document.getElementsByTagName('head')[0].appendChild(script)
	}
}

document.body.addEventListener('keydown',handler,false)

//miniConsole.js 中的代码
miniConsole = {
	log:function(){
		console.log(Array.prototype.join.call(arguments));
	}
}

//要保证在 F2 被重复按下的时候，miniConsole.js 只被加载一次
//miniConsole 代理对象的代码，使它成为一个标准的虚拟代理对象

var miniConsole = (function(){
	var cache = [];
	var handler = function(ev){
		if(ev.keyCode === 113){
			var script = document.createElement('script')
			script.onload = function(){
				for(var i=0,fn;fn = cache[i++];){
					fn()
				}
			};
			script.src = 'miniConsole.js'
			document.getElementsByTagName('head')[0].appendChild(script)
			//只加载一次
			document.body.removeEventListener('kedown',handler);
		}
	};

	document.body.addEventListener('keydown',handler,false)

	return {
		log:function(){
			var args = arguments;
			cache.push(function(){
				return miniConsole.log.apply(miniConsole,args);
			})
		}
	}
})()

miniConsole.log(11);

//miniConsole.js 中的代码
miniConsole = {
	log:function(){
		console.log(Array.prototype.join.call(arguments));
	}
}

//缓存代理 类似的联想到 vue computed
var multi = function(){
	console.log('开始计算成绩');
	var = 1;
	for(var i=0;i<arguments.length;i++){
		a = a * arguments[i]
	}
	return a;
}

multi(2,3)
multi(2,3,4,5)

//加入缓存代理
var proxyMult = (function(){
	var cache = {}

	return function(){
		var args = Array.prototype.join.call(arguments,',');
		if(args in cache){
			return cache[args];
		}
		return cache[args] = multi.apply(this,arguments);
	}
})()

proxyMult(1,2,,3,4)
proxyMult(1,2,3,4)


//缓存代理用于异步的ajax请求数据，分页的数据只要请求一次

//高阶函数动态创建代理

/*计算乘积*/
var multi = function(){
	console.log('开始计算成绩');
	var = 1;
	for(var i=0;i<arguments.length;i++){
		a = a * arguments[i]
	}
	return a;
}

/*计算加和*/
var plus = function(){
	console.log('开始计算成绩');
	var = 1;
	for(var i=0;i<arguments.length;i++){
		a = a + arguments[i]
	}
	return a;
}

/*创建缓存代理的工厂*/
var createProxyFactory = function(fn){
	var cache = {}
	return function(){
		var args = [].join.call(arguments,',')
		if(args in cache){
			return cache[args];
		}
		return cache[args] = fn.apply(this,arguments)
	}
}


var proxyMult = createProxyFactory( mult ), 
    proxyPlus = createProxyFactory( plus );

alert ( proxyMult( 1, 2, 3, 4 ) ); 
alert ( proxyMult( 1, 2, 3, 4 ) ); 
alert ( proxyPlus( 1, 2, 3, 4 ) ); 
alert ( proxyPlus( 1, 2, 3, 4 ) );

//javacript 在 JavaScript 开发中最常用的是虚拟代理和缓存代理