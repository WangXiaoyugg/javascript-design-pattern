var strategies = {
	'S':function (salary) {
		return salary *4
	},
	'A':function(salary){
		return salary * 3
	},
	'B':function(salary){
		return salary * 2
	}
}

var calculateBonus = function(level,salary){
	return strategies[level](salary);
}

console.log(calculateBonus('S',20000))
console.log(calculateBonus('A',10000))

//多态在策略模式中的体现
//编写动画，表单验证
//缓动算法 

// t 消耗的时间 ，b 原始位置 c 小球的目标位置 d 动画的持续时间
var tween = {
	linear:function(t,b,c,d){
		return c * t /d + b
	},
	easeIn:function(t,b,c,d){
		return c * ( t /= d)  * t + b
	},
	strongEaseIn: function(t, b, c, d){
		return c * ( t /= d ) * t * t * t
	},
	strongEaseOut: function(t, b, c, d){
		return c * ( ( t = t / d - 1) * t
	},
	sineaseIn: function( t, b, c, d ){
		return c * ( t /= d) * t * t + b; },
	sineaseOut: function(t,b,c,d){
		return c * ( ( t = t / d - 1) * t
	} 
}

//表单校验
/*
* 用户名不能为空
* 密码长度不能少于六位
* 手机号码必须时符合格式
*/

//给文本框添加多种校验规则

//策略模式的优点
//  策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
//  策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它
   // 们易于切换，易于理解，易于扩展。
//  策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
//  在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻
// 便的替代方案。

