//lkp 最小知识原则
//说的是一个软件实体应当尽可能少地与其他实体发生相互作用
genneral.getColonel(c).getMajor(m).getCaptain(c).getSergeant(s)
.getPrivate(p).digFoxhole();

//减少对象之间的联系
// 最少知识原则要求我们在设计程序时，应当尽量减少对象之间的交互
// 常见的做法是引入一个第三者对 象，来承担这些对象之间的通信作用

// 设计模式中的最少知识原则
// 1. 中介者模式 博彩公司
// 2. 外观模式 外观模式的作用是对客户屏蔽一组子系统的复杂性 一键洗衣按钮

// 封装在最少知识原则中的体现
// 要编写一个具有缓存效果的计算乘积的函数 
var mult = (function () {
	var cache = {};
	return function(){
		var args = Array.prototype.join.call(arguments,',');
		if(cache[args]){
			return cache[args]
		}
		var a = 1;
		for(var i=0,l=arguments.length;i<l;i++){
			a = a * arguments[i]
		}
		return cache[args] = a;
	}	
})()

mult(1,2,3)