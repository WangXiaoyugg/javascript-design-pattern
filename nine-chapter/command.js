// 有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请 求的操作是什么，
// 此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接 收者能够消除彼此之间的耦合关系

/*
按钮的绘制
<body>
	<button id='button1'> 点击按钮1 </button>
	<button id='button2'> 点击按钮2 </button>
	<button id='button3'> 点击按钮3 </button>
</body>

<script>
	var button1 = document.getElementById('button1')
	var button2 = document.getElementById('button2')
	var button3 = document.getElementById('button3')
</script>
*/

//setCommand 函数负责往按钮上面安装命令

var setCommand = function (button,command) {
	button.onclick = function(){
		command.execute();
	}
}

//点击按钮的之后具体行为是另一个程序员操作
var MenuBar = {
	refresh:function(){
		console.log('刷新菜单目录')
	}
}

var SubMenu = {
	add:function(){
		console.log('增加子菜单')
	},
	del:function(){
		console.log('删除子菜单')
	}
}

//把行为都封装在命令类中
var RefreshMenuCommand = function(receiver){
	this.receiver = receiver;
}

RefreshMenuCommand.prototype.execute = function(){
	this.receiver.refresh();
} 

var AddSubMenuCommand = function(receiver){
	this.receiver = receiver;
}
AddSubMenuCommand.prototype.execute = function(){
	this.receiver.add();
}

var DelSubMenuCommand = function(receiver){
	this.receiver = receiver
}

DelSubMenuCommand.prototype.execute = function(){
	console.log('删除子菜单')
}

// 最后就是把命令接收者传入到 command 对象中，并且把 command 对象安装到 button 上面
var refreshMenuCommand = new RefreshMenuCommand(MenuBar);
var adddSunMenuCommand = new AddSubMenuCommand(SubMenu);
var delSubMenuCommand = new DelSubMenuCommand(SubMenu);

setCommand(button1,refreshMenuCommand)
setCommand(button2,addSubMenuCommand)
setCommand(button3,delSubMenuCommand)

// 以上只是一个很简单的命令模式示例，但从中可以看到我们是如何把请求发送者和请求接收 者解耦开的

//JavaScript 中的命令模式
var bindClick = function(button,func){
	button.onclick = func;
}


var setCommand = function(button,func){
	button.onclick = function(){
		func()
	}
}

var MenuBar = {
	refresh:function(){
		console.log('refresh')
	}
}

var RefreshMenuCommand = function(receiver){
	return {
		excute:function(){
			receiver.refresh();
		}
	}
}

var refreshMenuCommand = RefreshMenuCommand(MenuBar);

setCommand(button1,refreshMenuCommand);

var setCommand = function(button,command){
	button.onclick = function(){
		command.execute();
	}
}

//命令模式撤销 可以用文本编辑器 ctrl + Z. 悔棋的功能 ，动画回退到之前的动作

//撤销和重做

//命令队列
// 所以我们可以把 div 的这些运动过程都封装成命令对象，再把它们压进一个队列堆栈，
// 当动 画执行完，也就是当前 command 对象的职责完成之后，会主动通知队列，
// 此时取出正在队列中等 待的第一个命令对象，并且执行它


// 宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令
var closeDoorCommand = {
	execute:function(){
		console.log('close door')
	}
}

var openPcCommand = {
	execute:function(){
		console.log('开电脑')
	}
}

var openQQCommand = {
	execute:function(){
		console.log('登录QQ')
	}
}

var MacroCommand = function(){
	return {
		commandList:[]
		add:function(command){
			this.commandList.push(command)
		},
		execute:function(){
			for(var i = 0, command;command = this.commandList[i++];){
				command.execute()
			}
		}
	}
}

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

//智能命令和傻瓜命令
//没有接收者的智能命令，退化到和策略模式非常相近，
var closeDoorCommand = {
	execute:function(){
		console.log('关门');
	}
}

