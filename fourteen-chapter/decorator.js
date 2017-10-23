//装饰者模式
// 给对象动态地增加职责

// 模拟传统面向对象语言的装饰者模式
var obj = {
	name:'smith',
	address:'上海',
};

obj.address = obj.address + '宝山区'

//仿飞机大战
var Plane = function () {};

Plane.prototype.fire = function(){
	console.log('emit normal bullet');
}

//增加两个装饰类，分别是导弹和原子弹
var MissileDecorator = function(plane){
	this.plane = plane;
}

MissileDecorator.prototype.fire = function(){
	this.plane.fire();
	console.log('emit missile')
}

var AtomDecorator = function(plane){
	this.plane = plane;
}

AtomDecorator.prototype.fire = function(){
	this.plane.fire();
	console.log('emit atom')
}

var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);

plane.fire();

//js的装饰者模式

var plane = {
	fire:function(){
		console.log('emit bullet')
	}
}

var missionDecorator = function(){
	console.log('emit missile')
}

var atomDecorator = function(){
	console.log('emit atom');
}

var fire1 = plane.fire;

plane.fire = function(){
	fire1();
	missileDecorator()
}

var fire2 = plane.fire

plane.fire = function(){
	fire2();
	atomDecorator();
}

plane.fire();

//执行顺序 fire2 => fire1 => fire => missileDecorator => atomDecorator

//装饰函数
//为函数添加功能，最简单粗暴的方式就是直接改写该函数
var a = function(){
	alert(1)
}

//改写成,违反封闭开放原则
var a = function(){
	alert(1)
	alert(2)
}

//保存原引用
var a = function(){
	alert(1)
}

var _a = a;
a = function(){
	_a();
	alert(a);
}

a();


//符合开放-封闭原则，增加新功能没有修改原来的代码
//必须维护window.onload的变量，函数的装饰链较长，需要的中间变量变多
// this 被劫持的问题
window.onload = function(){
	alert(1)
}

var _onload = window.onload || function(){};

window.onload = function(){
	_onload();
	alert(2);
}

// this 被劫持的问题
var _getElementById = document.getElementById;

document.getElementById = function(id){
	alert(1);
	return _getElementById(id);
}

var button = document.getElementById('button');//报错， this 不是指向 document 指向 window

//改进代码，手动把document 当上下文this 传给 _getElementById;
var _getElementById = document.getElementById;

document.getElementById = function(){
	alert(1);
	return _getElementById.apply(document,arguments);
}

//AOP 装饰函数
Function.prototype.before = function(beforeFn){
	var __self = this;
	return function(){
		beforeFn.apply(this,arguments);
		return __self.apply(this,arguments);
	}
}

Function.prototype.after = function(afterFn){
	var __self = this;
	return function(){
		var ret = __self.apply(this,arguments);
		afterFn.apply(this,arguments);
		return ret;
	}
}

//污染的原型，把原函数和新函数当作参数传递进去
var before = function(fn,beforeFn){
	return function(){
		beforeFn.apply(this,arguments);
		return fn.apply(this,arguments);
	}
}

var a = before(
	function(){console.log(1)},
	function(){console.log(2)}
)

a = before(a,function(){console.log(3)});
a();

//AOP 应用实例
//数据上报统计
//AOP 动态改变函数的参数
//AOP 插件式的表单验证

var func = function(param){
	console.log(param);
}
func = func.before(function(param){
	param.b = 'b';
})

func({a:'a'});

//发起ajax的伪代码
var ajax = function(type,url,param){
	console.dir(param);
}

ajax('get','http://xxx.com/userInfo',{name:'smit'});

//网站遭受了 CSRF 攻击。解决 CSRF 攻击最简单的一个办法就是在 HTTP 请求中带上一个 Token 参数
var getToken = function(){
	return 'Token';
}

//Token 带上太生硬了，不好移植
var ajax = function(type,url,param){
	param = param || {};
	param.token = getToken();
}

//AOP 解决
var ajax = function(type,url,param){
	console.log(param);
}

var getToken = function(){
	return 'Token';
}

ajax = ajax.before(function(type,url,param){
	param.Token = getToken();
})

ajax('get','http://xxx.com/userInfo',{name:'smith'});

//注意事项
// 函数通过 Function.prototype.before 或者 Function.prototype.after 被装 饰之后，
// 返回的实际上是一个新的函数，如果在原函数上保存了一些属性，那么这些属性会丢失

var func = function(){
	alert(1)
}

func.a = 'a'

func = func.after(function(){
	alert(2);
})

alert(func.a) // undefined;



