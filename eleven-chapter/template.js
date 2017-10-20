// 模板方法模式是一种只需使用继承就可以实现的非常简单的模式
// 模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类

//coffer or tea

var Coffee= function () {
	
}

Coffee.prototype.boilWater = function(){
	console.log('boilWater')
}
Coffee.prototype.brewCoffeeGriends = function(){
	console.log('brewCoffeeGriends')
}

Coffee.prototype.pourInCup = function(){
	console.log('pourInCup')
}

Coffee.prototype.addSugarAndMilk = function(){
	console.log('addSugarAndMilk')
}

Coffee.prototype.init = function(){
	this.boilWater();
	this.brewCoffeeGriends();
	this.pourInCup();
	this.addSugarAndMilk();
}

var coffee = new Coffee();
coffee.init();

//泡一壶茶
var Tea = function () {
	
}

Tea.prototype.boilWater = function(){
	console.log('boilWater')
}
Tea.prototype.steepTeaBag = function(){
	console.log('steepTeaBag')
}

Tea.prototype.pourInCup = function(){
	console.log('pourInCup')
}

Tea.prototype.addLemon = function(){
	console.log('addLemon')
}

Tea.prototype.init = function(){
	this.boilWater();
	this.steepTeaBag();
	this.pourInCup();
	this.addLemon();
}

var tea = new Tea();
tea.init();

/*
(1) 把水煮沸
(2) 用沸水冲泡饮料 
(3) 把饮料倒进杯子 
(4) 加调料
*/

var Beverage = function(){}

Beverage.prototype.boilWater = function(){
	console.log('boilWater')
}
Beverage.prototype.brew = function(){
	throw new Error('子类必须重写 brew 方法')
};
Beverage.prototype.pourInCup = function(){
	throw new Error('子类必须重写 pourInCup 方法')
};
Beverage.prototype.addCondiment = function(){
	throw new Error('子类必须重写 addCondiment 方法')
};

Beverage.prototype.customerWantsCondiment = function(){
	return true; //默认需要调料
}

// Beverage.prototype.init 被称为模板方法的原因是，
// 该方法中封装了子类的算法框架，它作 为一个算法的模板，
// 指导子类以何种顺序去执行哪些方法
Beverage.prototype.init = function(){
	this.boilWater()
	this.brew()
	this.pourInCup()
	if(this.customerWantsCondiment()){ // 如果挂钩返回 true，则需要调料
		this.addCondiment()
	}
	
};

var Coffee = function(){}
Coffee.prototype = new Beverage();

Coffee.prototype.brew = function(){
	console.log('用沸水冲泡咖啡')
}
Coffee.prototype.pourInCup = function(){
	console.log('把咖啡倒景杯子里')
}
Coffee.prototype.addCondiment = function(){
	console.log('加糖和牛奶')
}

var Coffee = new Coffee()
Coffee.init()

var Tea = function(){}
Tea.prototype = new Beverage();

Tea.prototype.brew = function(){
	console.log('用沸水浸泡茶叶')
}

Tea.prototype.pourInCup = function(){
	console.log('把茶叶倒进杯子')
}
Tea.prototype.addCondiment = function(){
	console.log('加柠檬')
}

var tea = new Tea()
tea.init()

//模版模式的使用场景
/**
模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，
 程序员继承框架的结构之后，负责往里面填空
**/

// 在 Web 开发中也能找到很多模板方法模式的适用场景
// ，比如我们在构建一系列的 UI 组件， 这些组件的构建过程一般如下所示:

/*
(1) 初始化一个 div 容器;
(2) 通过 ajax 请求拉取相应的数据;  不一样
(3) 把数据渲染到 div 容器里面，完成组件的构造; 不一样 
(4) 通知用户组件渲染完毕。
*/

//钩子方法(hook)可以用来解决这个问题，放置钩子是隔离变化的一种常见手段
var CoffeeWithHook = function(){}
CoffeeWithHook.prototype = new Beverage();
CoffeeWithHook.prototype.brew = function(){
	console.log('用沸水冲泡咖啡')
};
CoffeeWithHook.prototype.pourInCup = function(argument){
	console.log('把咖啡倒进杯子')
};
CoffeeWithHook.prototype.addCondiment = function(argument){
	console.log('加糖和牛奶')
};
CoffeeWithHook.prototype.customerWantsCondiment = function(argument){
	return window.confirm('请问需要调料吗？')
};

var coffeeWithHook = new CoffeeWithHook()
CoffeeWithHook.init();

//好莱坞原则
// 底层组件将自己 挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件
// 发布订阅模式 回调函数

//但在 JavaScript 中，我们很多时候都不需要依样画瓢地去实现一个模版方法模式，高阶函数 是更好的选择。

// 在好莱坞原则的指导之下，下面这段代码可以达到和继承一样的效果
var Beverage = function(param){
	var boilWater = function(){
		console.log('把水煮沸')
	};

	var brew = param.brew || function(){
		throw new Error('必须传递brew方法')
	};

	var pourInCup = param.pourInCup || function(){
		throw new Error('必须传递pourInCup方法')
	};

	var addCondiments = param.addCondiments || function(){
		throw new Error('必须传递addCondiments方法')
	};

	var F = function(){} //构造器

	F.prototype.init = function(){
		boilWater();
		brew();
		pourInCup();
		addCondiment();
	}

	return F;

}

var Coffee = Beverage({
	brew: function(){
		console.log( '用沸水冲泡咖啡' ); 
	},
	pourInCup: function(){
		console.log( '把咖啡倒进杯子' );
    },
     addCondiments: function(){
	console.log( '加糖和牛奶' ); 
	}
});

var Tea = Beverage({
	brew: function(){
		console.log( '用沸水浸泡茶叶' );
    },
	pourInCup: function(){
		console.log( '把茶倒进杯子' );
 	},
 	addCondiments: function(){
		console.log( '加柠檬' ); 
	}
});

var coffee = new Coffee();
coffee.init()

var tea = new Tea()
tea.init()