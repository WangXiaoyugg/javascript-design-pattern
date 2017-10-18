//this call apply

//this 作为对象的方法调用
var obj = {
	a: 1,
	getA: function(){
		console.log( this === obj)
		console.log(this.a)
	}
}

obj.getA();

//作为普通函数调用
window.name = 'globalName'

var getName = function(){
	return this.name;
}

console.log(getName());//输出 globalName

// 结果一样

var myObject = {
	name:'sven',
	getName:function(){
		return this.name;
	}
}

var getName = myObject.getName;
console.log( getName());//输出 globalName

//保存this 引用 that = this;

//this 作为构造器调用
var MyClass = function(){
	this.name = 'seve';
}
var obj = new MyClass();
console.log(obj.name) // seve

var MyGrade = function(){
	this.grade = 'A'
	return {
		grade:'B'
	}
}

var person = new MyGrade()
console.log( person.grade ) //B

var MyLove = function(){
	this.love = 'code'
	return 'game';
}

var student = new MyLove();
console.log( student.love) // game


// this Function.prototype.call 或是 Function.prototype.apply
var obj1 = {
	name :'seve',
	getName: function(){
		return this.name;
	}
}

var obj2 = {
	name:'anne'
}

console.log(obj1.getName()) // seve
console.log(obj2.getName.call(obj2)) // anne


//丢失的 this
document.getElementById = (function(func){
	return function(){
		return func.call(document,arguments);
	}
})(document.getElementById)

var getId = document.getElementById;
var div = getId('div1');

//非严格模式下
var func = function(a,b,c){
	alert(this === window)
	console.log(a,b,c)
}

func.apply(null,[1,2,3])

var func = function(a,b,c){
	'use strict'
	alert(this === null)
}

func.apply(null,[1,2,3])

//使用call,apply 不在于指定this 方向 ，借用其他对象的方法
Math.max.apply(null,[1,2,3,4,5]) // 数组久可以使用Math.max 

// bind 实现this 绑定
Function.prototype.bind = function(context){
	var that = this;
	console.log(that);
	return function(){
		return that.apply(context,arguments) 
	}
};

var obj = {
	name:'seve'
}

var func = function(){
	alert (this.name)
}.bind(obj)

func()

//复杂的 Function.prototype.bind
Function.prototype.bind = function(){
	var self = this,
		context = [].shift.call(arguments),
		args = [].slice.call(arguments);

	return function(){
		return self.apply(context,[].concat.call(args,[].slice.call(arguments)));
	}	
};	

var obj = {
	name:'seve'
}

var func = function(a,b,c,d){
	console.log(this.name)
	console.log([a,b,c,d])
}.bind(obj,1,2)

func(3,4) //组合两次传入的参数


// 3 借用其他对象的方法
(function(){
	Array.prototype.push.call(arguments,3)
	console.log(arguments);
})(1,2)


//Array.prototype.push
/*
 * 对象本身要可以存储属性 number 不可以
 * 对象的length 属性可以读写 function 不可以
 */

function ArrayPush(){
	var n = TO_UNIT32(this.length);//被push的对象的length
	var m = %_ArgumentsLength(); //push 的参数个数
	for(var i = 0; i<m ;i++{
		this[i+n] = %_Arguments(i);//复制元素
	}
	this.length = n + m; //修正 length 的属性值
	return this.length;
}












