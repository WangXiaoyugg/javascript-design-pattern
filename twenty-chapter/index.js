//接口和面向接口编程
//接口  库和模块提供的api
//java 等语言提供的关键字 interface
//面向接口编程中的接口 
//接口是对象能响应的请求的集合

//抽象类和interface的作用主要是
//1 通过向上转型来隐藏对象的真正类型，表现对象的多态性
//2 约定类和类之间的一些契约行为
// 动态类型语言中，对象的多态性是 与生俱来的

function show(obj){
	obj.show(); // Uncaught TypeError: undefined is not a function
}

var myObject = {};
show(myObject);

function show(obj){
	obj.show();
}

var myObject = {
	show:1,
}

show(myObject);

//此时，我们不得加上一些代码检查
function show(obj){
	if(obj && typeof obj.show === 'function'){
		obj.show()
	}
}

function show(obj){
	try{
		obj.show();
	}catch(e){
		console.log(e);
	}
}

var myObject = {};
show(myObject);

//用鸭子类型进行接口检查
var isArray = function(obj){
	return obj && typeof obj === 'object' && typeof obj.length === 'number'
		   && typeof obj.splice === 'function'; 
}

//用typescript 编写基于 interface 的命令模式
var RefreshMenuBarCommand = function(){};
RefreshMenuBarCommand.prototype.execute = function(){
	console.log("refresh menubar page");
};

var AddSubMenuCommand = function(){};
AddSubMenuCommand.prototype.execute = function(){
	console.log('add subMenu ');
}

var DelSubMenuCommand = function(){};

var refreshMenuBarCommand = new RefreshMenuBarCommand();
var addSubMenuCommand = new AddSubMenuCommand();
var delSubMenuCommand = new DelSubMenuCommand();

var setCommand = function(command){
	document.getElementById('exeCommand').onclick = function(){
		if(typeof command.execute !== 'function'){
			throw new Error('command 对象必须实现 execute 方法');
		}
		command.execute();
	}
}

setCommand(refreshMenuBarCommand);
setCommand(addSubMenuCommand);
setCommand(delSubMenuCommand);//报错Uncaught TypeError: undefined is not a function


//typescript 版本
interface Command {
	execute : Function;
}
class RefreshMenuBarCommand implements Command {
	constructor(){}

	execute(){
		console.log('refresh menu page')
	}
}

class AddSubMenuCommand implements Command {
	constructor(){}
	execute(){
		console.log('add sub menu')
	}
}

class DelSubMenuCommand implements Command {
	constructor(){}
}

var refreshMenuBarCommand = new RefreshMenuBarCommand();
var addSubMenuCommand = new AddSubMenuCommand();
var delSubMenuCommand = new DelSubMenuCommand();

refreshMenuBarCommand.execute();
addSubMenuCommand.execute();
delSubMenuCommand.execute();//输出:Uncaught TypeError: undefined is not a function
