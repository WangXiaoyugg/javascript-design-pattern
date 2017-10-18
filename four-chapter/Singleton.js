//保证一个类仅有一个实例，并提供一个访问它的全局访问点
// 应用场景对象只要一个 ： 线程池，全局缓存，浏览器的windwo对象

// 登录浮窗很适合
// 用一个变量来标志当前是否已经为某个类创建过对象
var Singleton  = function (name) {
	this.name = name;
	this.instance = null;// 声明全局的实例
}

Singleton.prototype.getName = function(){
	console.warn(this.name)
}

Singleton.getInstance = function(name){
	if(! this.instance){
		this.instance = new Singleton(name);
	}
	console.log('instance',this.instance);
	return this.instance;
}

var  a = Singleton.getInstance('seve1');
var  b = Singleton.getInstance('seve2');

console.log( a === b);

var Singleton = function(name){
	this.name = name;
}

Singleton.prototype.getName = function(){
	console.warn(this.name);
};

Singleton.getInstance = (function(){
	var instance = null;
	return function(name){
		if(!instance){
			instance = new Singleton(name);
		}

		return instance
	}
})()

// var a = Singleton.getInstance( 'sven1' );
// var b = Singleton.getInstance( 'sven2' );
// alert ( a === b ); // true


// 上面做法增加了类的不透明性,透明的单例模式

// 创建唯一的div节点
var CreateDiv = (function(){
	var instance;
	return function(html){
		if(!instance){
			return instance
		}
		this.html = html;
		this.init();
		return instance = this;
	}

	CreateDiv.prototype.init = function(){
		var div = document.createElement('div');
		div.innerHTML = this.html;
		document.body.appendChild(div);
	}

})()
var a = new CreateDiv('sev1')
var b = new CreateDiV('sev2')

alert(a === b);

//用代理模式实现单例模式
var CreateDiv = function(html){
	this.html = html;
	this.init()
}

CreateDiv.prototype.init = function(){
	var div = document.createElement('div')
	div.innerHTML = this.html;
	document.body.appendChild(div);
};

//引入代理类 proxySingletonCreateDiv, 负责管理单例逻辑

var proxySingletonCreateDiv = (function(){
	var instance ;

	return function(html){
		if(!instance){
			instance = new CreateDiv(html);
		}
		return instance;
	}
})()

var a = new proxySingletonCreateDiv('sev1');
var b = new proxySingletonCreateDiv('sev2');
alert(a === b)

//减少全局变量
//1 使用命名空间
var namespace1 = {
	a:function(){},
	b:function(){}
}

//动态创建命名空间
var MyApp = {}
MyApp.namespace = function(name){
	var parts = name.split('.')
	var current = MyApp;
	for(var i in parts){
		console.log('current',current)
		if(!current[parts[i]]){
			current[parts[i]] = {}
		}
		current = current[parts[i]] // current 指向 新生的dom{}
	}
}
MyApp.namespace('event')
MyApp.namespace('dom.style') 
//['dom','style'] MyApp[dom] = {}
// MyApp[style] = {}

//闭包封装私有变量
var user = (function(){
	var __name = 'seve';
	var __age = 10;

	return {
		getUserInfo:function(){
			return __name + ' : ' + __age;
		}
	}
})() 

//惰性单例指的是在需要的时候才创建对象实例。惰性单例是单例模式的重点
//qq 登录框 ，一种是在页面加载时就创建好div 浮窗，用户点击时才开始显示
//一种是 用户点击时才开始创建该浮窗 达到了惰性的效果，失去了单例的效果
//利用标志位判断是否创建过登录浮窗

var createLoginLayer = function(){
	var div = document.createElement('div')
	div.innerHTML = '我是登录浮窗'
	div.style.display = 'none'
	document.body.appendChild(div)
	return div;
}

document.getElementById('login').onclick = function(){
	var loginLayer =createLoginLayer()
	loginLayer;.style.display = 'block'
}

//单一职能 抽离代码 创建对象 管理单例

//单例模式 ，ajax 动态的往列表里去追加数据，在使用事件代理的前提
// 下，click 事件实际上只需要在第一次渲染列表的时候被绑定一次
// 但是我们不想去判断当前是 否是第一次渲染列表，如果借助于 jQuery，
// 我们通常选择给节点绑定 one 事件

/*
在 getSinge 函数中，实际上也提到了闭包和高阶函数的概念。
单例模式是一种简单但非常实 用的模式，特别是惰性单例技术，
在合适的时候才创建对象，并且只创建唯一的一个。
更奇妙的 是，创建对象和管理单例的职责被分布在两个不同的方法中，
这两个方法组合起来才具有单例模 式的威力
*/

