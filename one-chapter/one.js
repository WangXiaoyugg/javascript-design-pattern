 var duck = {
 	duckSinging:()=>{
 		console.log('嘎嘎嘎')
 	}
 }

 var chicken = {
 	duckSinging:()=>{
 		console.log('嘎嘎嘎')
 	}
 }

 var choir = []

 var joinChoir = (animal) => {
 	if(animal && typeof animal.duckSinging === 'function'){
 		choir.push(animal)
 		console.log('恭喜你加入合唱团')
 		console.log('合唱团已有的成员数量')
 	}
 }

 //多态
 var makeSound = (animal)=>{
 	if(animal instanceof Duck){
 		console.log('嘎嘎嘎')
 	}else if(animal instanceof Chicken){
 		console.log('咯咯咯')
 	}
 }

 var Duck = function(){}
 var Chicken = function(){}

 makeSound(new Duck())
 makeSound(new Chicken())

 //多态实现
 var makeSound1 = (animal)=>{
 	animal.sound()
 }

 var Duck1 = function(){}
 Duck1.prototype.sound = function(){
 	console.log('嘎嘎嘎')
 };

 var Chicken1 = function(){
 	console.log('咯咯咯')
 }

 var Dog = function(){}
 Dog.prototype.sound = function(){
 	console.log('汪汪汪')
 };

 makeSound1(new Duck1())
 makeSound1(new Chicken1())
 makeSound1(new Dog())

//类型检查和多态

//多态在面向对象程序设计中的作用
var googleMap = {
	show:()=>{
		console.log('开始渲染谷歌地图')
	}
};

var baidduMap = {
	show:() => {
		console.log('开始渲染百度地图')
	}
}

var renderMap = (type) => {
	if(type === 'goole'){
		googleMap.show();
	}else if(type === 'baidu'){
		baidduMap.show();
	}
}

renderMap('google')
renderMap('baidu')

var renderMap = (map) =>{
	if(map.show instanceof Function){
		map.show();
	}
}
renderMap(googleMap)
renderMap(baidduMap)
renderMap(); //开始渲染地图


//封装

//使用克隆的原型模式
var Plane = function(){
	this.blood = 100;
	this.attackLevel = 1;
	this.defenseLevel = 1;
}

var plane = new Plane()
plane.blood = 500
plane.attackLevel = 10
plane.defenseLevel = 7

var clonePlane = Object.create(plane)
console.log(plane)

//对象的继承 object.create 继承写法
Object.create = new Object.create || function(obj){
	var F = function(){};
	F.prototype = obj;
	return new F();
}

//原型编程范型基本规则
//1. 所有数据都是对象
//2. 要得到一个对象，不能通过实例化类，而是找到一个对象作为原型并克隆它
//3. 对象会记住它的原型
//4. 如果对象无法响应某个请求，他会把这个请求委托给自己的原型

//new 的实现方式 难点
function Person(name){
	this.name = name
}
Person.prototype.getName = function(){
	return this.name;
}

var objectFactory = function(){
	var obj = new Object()
	var Constructor = [].shift.call(arguments);
	obj.__proto__ = Constructor.prototype ;//指向正确的原型

	//借助外部传人的构造器给 obj设置属性
	var ret = Constructor.apply(obj,arguments);

	return typeof ret === 'object' ? ret : obj;
}

var a = objectFactory( Person ,'smith');

console.log(a.name)
console.log(a.getName())
console.log(Object.getPrototypeOf(a) === Person.prototype)

// 等同于 var a = new A('sten')

//es6 class
class Animal {
	constructor(name){
		this.name = name;
	}

	getName(){
		return this.name
	}
}

class Dog extends Animal {
	constructor(name){
		super(name);
	}
	speak(){
		return 'woof'
	}
}

var dog = new Dog('scamp')
console.log(dog.getName() + ' says ' + dog.speak());








