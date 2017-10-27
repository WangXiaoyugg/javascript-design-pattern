// 开放-封闭原则(OCP
// 软件实体(类、模块、函数)等应该是可以扩展的，但是不可修改

// 最明显的就是找出程序 中将要发生变化的地方，然后把变化封装起来
// 1. 放置挂钩
// 2. 使用回调函数
var arrayMap = function (array,callback) {
	var i = 0,
		l = array.length,
		value,
		ret = [];

	for(;i<l;i++){
		value = callback(i,array[i]);
		ret.push(value);
	}	

	return ret;
}

var a = arrayMap([1,2,3],function(i,n){
	return n * 2;
})

var b = arrayMap([1,2,3],function(i,n){
	return n * 3;
})

// 设计模式中的开放-封闭原则
//1.发布-订阅模式
//2. 模板方法模式
// 3. 策略模式
// 4. 代理模式
// 5. 职责链模式

// 挑选出最容易发生变化的地方，然后构造抽象来封闭这些变化
// 在不可避免发生修改的时候，尽量修改那些相对容易修改的地方
// 用对象的多态性消除条件分支