//闭包和高阶函数

//变量的生命周期
/*
 * 全局变量的生命周期是永久的 除非主动销毁
 * 局部变量用完销毁
 */

 var func = function(){
 	var a = 1;
 	return function(){
 		a++;
 		console.log(a);
 	}
 }

 var f = func();

 document.getElementsByTagName('div')
 for(var i=0;i< nodes.length;i++){
 	nodes[i].onclick = function(){
 		console.log(i)
 	}
 } // 5 5 5 5 5

document.getElementsByTagName('div')
 for(var i=0;i< nodes.length;i++){
 	(function(i){
 		nodes[i].onclick = function(){
 			console.log(i)
 		}	
 	})(i)	
}

var Type = {};
for(var i = 0 ,type; type = ['String','Array','Number'][i++];){
	(function(type){
		Type['is' + type ] = function(obj){
			return Object.prototype.toString.call(obj) === '[object'+ type+']'
		}
	})(type)
}
Type.isArray([]);
Type.isString('str');

//闭包的作用 
//封装变量

var mult = function(){
	var cache = {}
	var calculate = function(){
		var a = 1;
		for(var i=0;i<arguments.length;i++){
			a = a * arguments;
		}
		return a;
	}

	return function (){
		var args = Array.prototype.join.call(arguments,',')
		if(cache[args]){
			return cache[args];
		}
		return cache[args] = calculate.apply(null,arguments);
	}
}

console.log(mult(1,2,3));
console.log(mult(1,2,3));

//延长局部变量的寿命
var report = function(src){
	var img = new Image();
	img.src = src;
}
report('http://www.xxx.com/getUserInfo');

var report = (function(){
	var imgs = [];
	return function(src){
		var img = new Image();
		imgs.push(img);
		img.src = src;
	}
})()

//闭包和面向对象设计

//闭包
var extent = function(){
	var value = 0;
	return {
		call:function(){
			value++;
			console.log(value);
		}
	}
}
var extent = extent();

extent.call();
extent.call();
extent.call();

//面向对象的写法
var extent = {
	value:0,
	call:function(){
		this.value++;
		console.log(this.value);
	}
}

extent.call();
extent.call();
extent.call();


//或者 
var Extent = function(){
	this.value = 0;
}

Extent.prototype.call = function(){
	this.value++;
	console.log(this.value)
}

var extent = new Extent();

extent.call();
extent.call();
extent.call();

//面向对象的方式写一段命令式的代码
var TV = {
	open:()=>{
		console.log('打开电视机')
	},
	close:()=>{
		console.log('关上电视机')
	}
}

var OpenTvCommand = function(receiver){
	this.receiver = receiver;
}

OpenTvCommand.prototype.execute = function(){
	this.receiver.open(); //执行命令，打开电视机
}

OpenTvCommand.prototype.undo = function(){ 
	this.receiver.close(); //撤销命令，关闭电视机
}

var setCommand = function(command){
	document.getElementById('execute').onclick = function(){
		command.execute()
	}
	document.getElementById('undo').onclick = function(){
		command.close()
	}
}

setCommand(new OpenTvCommand(TV))

var Tv = {
	open:function(){
		console.log('打开电视机')
	},
	close:function(){
		console.log('关闭电视机')
	}
}

var createCommand = function(receiver){
	var execute = function(){
		return receiver.open()
	}

	var undo = function(){
		return receiver.close()
	}

	return {
		execute:execute,
		undo:undo
	}
}

var setCommand1 = function(command){
	document.getElementById('execute').onclick = function(){
		command.execute()
	}
	document.getElementById('undo').onclick = function(){
		command.close()
	}
}

setCommand1( createCommand(Tv));

//闭包和内存管理
//两个对象之间形成了循环引用，那么这两个对象都无法被回收，但循环引用
// 造成的内存泄露在本质上也不是闭包造成的
// 要解决循环引用带来的内存泄露问题，我们只需要把循环引用中的变量设为 null

//高阶函数
/*
* 1. 函数是可以作为函数被参数传递
* 2. 函数可以作为返回值输出
*/

//函数作为参数传递
// 1. 回调函数
var getUserInfo = function(userId,callback){
	$.ajax('http://www.xxx.com/getUserInfo?' + userId,(data)=>{
		if(typeof callback === 'function'){
			callback(data);
		}
	})
}

getUserInfo(8888,(data)=>{console.log(data)})

//硬编码
var appendDiv = function(){
	for(var i=0;i<100;i++){
		var div = document.createElement('div')
		div.innerHTML = i;
		document.body.appendChild(div)
		div.style.display = 'none'
	}
}

appendDiv()


var appendDiv1 = function(){
	for(var i=0;i<100;i++){
		var div = document.createElement('div')
		div.innerHTML = i;
		document.body.appendChild(div)
		if(typeof callback === 'function'){
			callback(div)
		}
	}
}

appendDiv((node) =>{
	node.style.display = 'none'
})


// 2. Array.prototype.sort

//从小到大 
[1,2,4].sort((a,b)=>{
	return a-b;
})

//从大到小
[1,4,3].sort((a,b)=>{
	return b-a;
})

//函数作为返回值输出

// 1. 判断数据的类型
var isString = function(obj){
	return Object.prototype.toString.call(obj) === '[object String]'
}

var isArray = function(obj){
	return Object.prototype.toString.call(obj) === '[object Array]'
}

var isNumber = function(obj){
	return Object.prototype.toString.call(obj) === '[object Number]'
}


var isType = function(type){
	return function(obj){
		return Object.prototype.toString.call(obj) === '[object'+ type +']';
	}
}

var isString = isType('String')
var isArray = isType('Array')
var isNumber = isType('Number')

var getSingle = function(fn){
	var ret;
	return function(){
		return ret || (ret = fn.apply(this,arguments))
	}
}

var getScript = getSingle(()=>{
	return document.createElement('script')
})

var script1 = getScript()
var script2 = getScript()
console.log( script1 === script2)

//AOP 面向切片编程
Function.prototype.before = function(beforefn){
	var __self = this; //保存原函数的引用
	return function(){ //返回原函数和新函数的代理函数
		beforefn.apply(this,arguments); //执行新函数，修正this
		return __self.apply(this,arguments) //执行原函数
	}
}

Function.prototype.after = function(afterfn){
	var __self = this;
	return function(){
		var ret = __self.apply(this,arguments)
		afterfn.apply(this,arguments)
		return ret;
	}
};

var func = function(){
	console.log(2);
}

func = func.before(function(){
	console.log(1)
}).after(function(){
	console.log(3)
});

func();

//高阶函数的其他应用

//1. 柯里化

var monthlyCost = 0;
var cost = function(money){
	monthlyCost += money
}

cost(100)
cost(200)
cost(300)

console.log(monthlyCost);

var cost = (function(){
	var args = [];
	
	return function(){
		if(arguments.length === 0){
			var money = 0;
			for(var i=0,i<args.length;i++){
				money += args[i]
			}
			return money
		}else{
			[].push.apply(args,arguments);
		}
	}
})()

cost(100)
cost(200)
cost(300)

console.log(cost())


//通用的柯里化
var currying = function(fn){
	var args = []
	return function(){
		if(arguments.length === 0){
			return fn.apply(this,args)
		}else{
			[].push.apply(args,arguments)
			return arguments.callee
		}
	}
}

var cost = (function(){
	var money = 0;
	return function(){
		for(var i=0;i<arguments.length;i++){
			money += arguments[i]
		}
		return money
	}
})()

cost = currying(cost);

cost(100)
cost(200)
cost(300)

console.log(cost())

//2. uncurrying
Function.prototype.uncurrying = function(){
	var slef = this; //self 此时是 Array.prototype.push
	return function(){
		var obj = Array.prototype.shif.call(arguments)
		return self.apply(obj,arguments) // 相当于 Array.prototype.push.apply( obj, 2 )
	}
}

for(var i=0,fn,ary=['push','shift','forEach'];fn=ary[i++];){
	Array[fn] = Array.prototype[fn].uncurrying();
}

var obj= {
	length:'3',
	'0':1,
	'1':2,
	'2':3
}

Array.push(obj,4)

Function.prototype.uncurrying = function(=){
	var self = this;
	return  function(){
		return Function.prototype.call.apply(self,arguments);
	}
};


//3. 函数截流
/*
 * 1. window.onresize
 * 2. mousemove
 * 3. 上传文件

 * 截流的原理
 * 按时间段忽略一部分事件请求 重点
 */

var throttle = function(fn,interval){
	var __self = fn ; //保存函数的引用
	var timer;
	var fisrtTime = true;

	return function (){ 
		var args = arguments;
		var __me = this; //指向window;

		console.log('__me',__me) //	
		if(fisrtTime){
			__self.apply(__me,args);
			return fisrtTime = false;
		}

		if(timer){
			return false;
		}

		timer = setTimeout(function(){
			clearTimeout(timer)
			timer = null
			__self.apply(__me,args)
		},interval || 500)
	}
}

window.onresize = throttle(function(){
	console.log(1);
},500)

//分时函数
var ary = []
for(var i=1;i<=1000;i++){
	ary.push(1)
}

var renderFriendList = function(data){
	for(var i=0;i<=data.length;i++){
		var div = document.createElement('div')
		div.innerHTML = i;
		document.body.appendChild(div)
	}
}
renderFriendList(ary)

var timeChunk = function(ary,fn,count){
	var obj,t;

	var len = ary.length;

	var start = function(){
		for(var i=0;i<Math.min(count || 1 , ary.length);i++){
			var obj = ary.shift();
			fn(obj)
		}
	}

	return function(){
		t = setInterval(function(){
			if(ary.length === 0){
				return clearInterval(t)
			}
			start()
		},200)
	}
}

var  array = [];

for(var i=1;i<=1000;i++){
	array.push(i);
};

var renderFriendList = timeChunk(array,function(n){
	var div = document.createElement('div');
	div.innerHTML = n ;
	document.body.appendChild(div);
},8);

renderFriendList();

//惰性加载函数
//函数缺点没吃调用都会执行if 条件分支，开销较大
var addEvent = function(elem,type,handler){
	if(window.addEventListener){
		return elem.addEventListener(type,handler,false);
	}
	if(window.attachEvent){
		return elem.attachEvent('on'+type,handler)
	}
}

//嗅探浏览器的操作提前到代码加载的时候，在代码加载的时候就立刻进行一次判断
//缺点 从头到尾都没有使用过 addEvent 函数，这样看
// 来，前一次的浏览器嗅探就是完全多余的操作，而且这也会稍稍延长页面 ready 的时间
var addEvent = (function(){
	if(window.addEventListener){
		return function(elem,type,handler){
			elem.addEventListener(type,handler,false);
		}
	}
	if(window.attachEvent){
		return function(elem,type,handler){
			elem.attachEvent('on'+type,handler)
		}
	}

})()

//惰性函数
var addEvent = function(elem,type,handler){
	if(window.addEventListener){
		//重写 addEvent
		addEvent = function(elem,type,handler){
			elem.addEventListener(type,handler,false)
		}
	}else if(window.attachEvent){
		addEvent = function(elem,type,handler){
			elem.addEventListener('on'+type,handler);
		}
	}

	addEvent(elem,type,handler)
}

var div = document.getElementById('div1')
addEvent(div,'click',() => {console.log(1)})
addEvent(div, 'click', () => {console.log(2)})

