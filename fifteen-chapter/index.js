//状态模式
// 状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变

//电灯程序
var Light = function () {
	this.state = 'off';
	this.button = null;
}

Light.prototype.init = function(){
	var button = document.createElement('button');
	var self = this;

	button.innerHTML = '开关';
	this.button = document.body.appendChild(button);
	this.button.onclick = function(){
		self.buttonWasPressed();
	}
}

Light.prototype.buttonWasPressed = function(){
	if(this.state === 'off'){
		console.log('开灯');
		this.state = 'on';
	}else if(this.state === 'on'){
		console.log('关灯');
		this.state = 'off';
	}
};

var light = new Light();
light.init();

//有的电灯不止2种状态
Light.prototype.buttonWasPressed = function(){
	if(this.state === 'off'){
		conosle.log('弱光')；
		this.state = 'weakLight';
	}else if(this.state === 'weakLight'){
		console.log('强光')
		this.state = 'strongLight';
	}else if(this.state === 'strongLight'){
		console.log('关灯')
		this.state = 'off';
	}
};

//上面程序的缺点
/*
*违反封闭-开放原则
*状态有关的行为，都被封装在buttonWasPressed方法里
*状态切换非常不明显，仅仅表现对state变量赋值
*状态之间的切换关系，堆砌if-else语句  
*/

// 状态模式改进电灯程序
var offLightState = function(light){
	this.light = light;
}

offLightState.prototype.buttonWasPressed = function(){
	console.log('弱光')；
	this.light.setState(this.light.weakLightState);
}

var weakLightState = function(light){
	this.light = light;
}

weakLightState.prototype.buttonWasPressed = function(){
	console.log('强光');
	this.light.setState(this.light.strongLightState);
}

var strongLightState = function(light){
	this.light = light;
}

strongLightState.prototype.buttonWasPressed = function(){
	console.log('关灯')
	this.light.setState(this.light.offLightState);
};

var Light = function(){
	this.offLightState = new offLightState(this);
	this.weakLightState = new weakLightState(this);
	this.strongLightState = new strongLightState(this);
	this.button = null;
}

Light.prototype.init = function(){
	var button = document.createElement('button');
	var self = this;

	this.button.innerHTML = '开关';
	this.button = document.body.append(button);
	this.curState = this.offLightState;

	this.button.onclick = function(){
		self.curState.buttonWasPressed();
	}
}

Light.prototype.setState = function(newState){
	this.curState = newState;
};

var light = new Light();
light.init();

//应用举例 文件上传的状态多
// 文件上传的状态切换相比要复杂得多，控制文件上传的流程需要两个节点按钮，
// 第一个用 于暂停和继续上传，第二个用于删除文件
// 文件在扫描状态中，是不能进行任何操作的，既不能暂停也不能删除文件
// 传过程中可以点击暂停按钮来暂停上传，暂停后点击同一个按钮会继续上传
// 扫描和上传过程中，点击删除按钮无效，只有在暂停、上传完成、上传失败之后，才能删除文件

window.external.upload = function(state){
	console.log(state);
}

var plugin = (function(){
	var plugin = document.createElement('embed');
	plugin.style.display = 'none';

	plugin.type = 'application/txftn-webkit';

	plugin.sign = function(){
		console.log('开始文件扫描')
	}

	plugin.pause = function(){
		console.log('暂停文件上传')
	}

	plugin.uploading = function(){
		console.log('开始文件上传');
	}

	plugin.del = function(){
		console.log('删除文件上传');
	}

	plugin.done = function(){
		console.log('文件上传完成')
	}

	document.body.appendChild(plugin);

	return plugin;

})()

var Upload = function(filename){
	this.plugin = plugin;
	this.filename = filename;
	this.button1 = null;
	this.button2 = null;
	this.state = 'sign';
}

Upload.prototype.init = function(){
	var self = this;
	this.dom = document.createElement('div');
	this.dom.innerHTML = 
	'<span>文件名称:'+ this.fileName +'</span>\ 
	<button data-action="button1">扫描中</button>\ 
	<button data-action="button2">删除</button>';

	document.body.appendChild(this.dom);
	this.button1 = this.dom.querySelector('[data-action="button1"]')
	this.button2 = this.dom.querySelector('[data-action="button2"]')
	this.bindEvent();

};

Upload.prototype.bindEvent = function(){
	var self = this;
	this.button1.onclick = function(){
		if(self.state === 'sign'){
			console.log("扫描中，点击无效...")
		}else if (self.state === 'uploading'){
			self.changeState('pause');
		}else if(self.state === 'pause'){
			self.changeState('uploading');
		}else if(self.state === 'done'){
			console.log('文件已完成上传，点击无效')
		}else if(self.state === 'error'){
			console.log('文件上传失败，点击无效')
		}
	};

	this.button2.onclick = function(){
		if(self.state === 'done' || self.state === 'error' || self.state === 'pause'){
			self.changeState('del')
		}else if (self.state === 'sign'){
			console.log('文件正在扫描中，不能删除')
		}else if(self.state === 'uploading'){
			console.log('文件正在上传中，不能删除')
		}
	}
}

Upload.prototype.changeState = function(state){
	switch (state) {
		case 'sign':
			this.plugin.sign();
			this.button1.innerHTML = '扫描中，任何操作无效'
			break;
		case 'uploading':
			this.plugin.uploading();
			this.button1.innerHTML = '正在上传，点击暂停'
			break;
		case 'pause':
			this.plugin.pause();
			this.button1.innerHTML = '已暂停，点击继续上传'
			break;
		case 'done':
			this.plugin.done();
			this.button1.innerHTML = '上传完成'
			break;
		case 'error':
			this.button1.innerHTML = '上传失败'
			break;
		case 'del':
			this.plugin.del();
			this.dom.parentNode.removeChild(this.dom);
			break;			
	}
	this.state = state;
}

// 状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态 类，很容易增加新的状态和转换
//避免 Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了 Context 中原本过 5 多的条件分支
// 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然
 // Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响
 // 状态模式的缺点是会在系统中定义许多状态类，编写 20 个状态类是一项枯燥乏味的工作， 而且系统中会因此而增加不少对象。
 // 另外，由于逻辑分散在状态类中，虽然避开了不受欢迎的条 件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑

// 策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请 求委托给这些类来执行

// JavaScript 可以非常方便地使用委托技术，并不需要事先让 一个对象持有另一个对象。下面的状态机选择了通过 Function.prototype.call 方法直接把请求委 托给某个字面量对象来执行
// https:// github.com/jakesgordon/ javascript-state-machine [表驱动的有限状态机]

var Light = function(){
	this.currState = FSM.off; // 设置当前状态 this.button = null;
};
Light.prototype.init = function(){
	var button = document.createElement( 'button' ),
	self = this;
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild( button );
	this.button.onclick = function(){ 
		self.currState.buttonWasPressed.call( self );
	}; 
};
var FSM = { 
	off: {
			buttonWasPressed: function(){
				console.log( '关灯' ); 
				this.button.innerHTML = '下一次按我是开灯'; 
				this.currState = FSM.on;
			} 
	},
	on: {
			buttonWasPressed: function(){
				console.log( '开灯' ); 
				this.button.innerHTML = '下一次按我是关灯'; 
				this.currState = FSM.off;
			}		
	}		
}
var light = new Light(); 
light.init();