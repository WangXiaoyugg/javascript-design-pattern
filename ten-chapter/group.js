//复习宏模式
var ReadCommand = {
	execute:function () {
		console.log('读书')
	}
}

var WriteCommand = {
	execute:function(){
		console.log('写文章')
	}
}

var EatDinnerCommand = {
	execute:function(){
		console.log('吃饭了')
	}
}

var MicroCommand = {
	commandList: [],
	add:function(command){
		this.commandList.push(command)
	},
	execute:function(){
		for(var i = 0,command;command=this.commandList[i++];){
			command.execute()
		}
	}
};

// var macroCommand = MacroCommand();

MicroCommand.add(ReadCommand);
MicroCommand.add(WriteCommand);
MicroCommand.add(EatDinnerCommand);

MicroCommand.execute();

/**函数返回的宏模式**/
var ReadCommand = {
	execute:function () {
		console.log('读书')
	}
}

var WriteCommand = {
	execute:function(){
		console.log('写文章')
	}
}

var EatDinnerCommand = {
	execute:function(){
		console.log('吃饭了')
	}
}

var MacroCommand = function() {
	return {
		commandList: [],
		add:function(command){
			this.commandList.push(command)
		},
		execute:function(){
			for(var i = 0,command;command=this.commandList[i++];){
				command.execute()
			}
		}
	}
	
};

var macroCommand = MacroCommand();

macroCommand.add(ReadCommand);
macroCommand.add(WriteCommand);
macroCommand.add(EatDinnerCommand);

macroCommand.execute();

/** 组合模式的用途**/
/*
*更强大的宏命令
*打开空调
*打开电视和影响
*关门 开电脑 登录QQ
*/


// 组合模式最大的优点在于可以一致地对待组合对象和基本对象

//组合模式的注意事项
/**
1. 组合模式不是父子关系 是聚合关系 HAS-A
2. 对叶子对象操作的一致性
3. 双向映射关系
4. 用职责链模式提高组合模式的性能
**/

//删除引用父亲节点 

//组合模式的使用场景
/*
1. 对象的部分 - 整体层次结构
2. 客户希望统一对待书中的所有对象
*/

//组合模式的缺陷
/*
1.  每个对象差不多，差别只有在运行时才显现出来 ，可读性差
2.  创建过多的对象，占用内存过大，耗性能
*/