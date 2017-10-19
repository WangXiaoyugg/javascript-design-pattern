
// 第一点说明发布—订阅模式可以广泛应用于异步编程中，
// 这是一种替代传递回调函数的方案

// 第二点说明发布—订阅模式可以取代对象之间硬编码的通知机制，
// 一个对象不用再显式地调 用另外一个对象的某个接口。

//自定义事件 
//首先要指定好谁充当发布者(比如售楼处)
//然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者(售楼处的花名册);
//最后发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函
// 数(遍历花名册，挨个发短信)

var salesOffices = {} ;

salesOffices.clientList = [];

salesOffices.listen = function (fn) {
	this.clientList.push(fn)
}

salesOffices.trigger = function(){
	for(var i=0,fn;fn = this.clientList[i++];){
		fn.apply(this,arguments);
	}
}

salesOffices.listen(function(price,squareMeter){
	console.log('价格 : ' + price)
	console.log('squareMeter= ' + squareMeter);
})

salesOffices.listen(function(price,squareMeter){
	console.log('price = ' + price)
	console.log('squareMeter =' squareMeter)
})

salesOffices.trigger(200000,10)
salesOffices.trigger(3000000,100)

//所以我们有必要增加一个标示 key， 让订阅者只订阅自己感兴趣的消息
var salesOffices = {}

salesOffices.clientList = {} //因为有key，所以存放订阅者的对象，
/*
* obj = {
	key:[fn]
}
*/
salesOffices.listen = function(key,fn){
	if(!this.clientList[key]){
		this.clientList[key] = []
	}
	this.clientList[key].push(fn)
}

salesOffices.trigger = function(){
	var key = Array.prototype.shift.call(arguments);
	var fns = this.clientList[key];

	if(!fns  || fns.length === 0){
		return false;
	}

	for(var i = 0, fn;fn = fns[i++];){
		fn.apply(this,arguments)
	}
}

salesOffices.listen('squareMeter88',function(price){
	console.log('price = ' + price )
})

salesOffices.listen('squareMeter110',function(price){
	console.log('price = ' + price )
})

salesOffices.trigger(200000,10)
salesOffices.trigger(3000000,100)

//发布-订阅的通用实现 
// 有没有办法可以让 所有对象都拥有发布—订阅功能呢?

var event = {
	clientList : {},
	listen: function(key,fn){
		if(!this.clientList[key]){
			this.clientList[key] = [];
		}
		this.clientList[key].push(fn)
	},
	trigger:function(){
		var key = [].shift.call(arguments)
		var fns = this.clientList[key]

		if(!fns || fns.length === 0){
			return false;
		}

		for(var i=0,fn;fn = fns[i++];){
			fn.apply(this,arguments);
		}
	}
}

// 一个 installEvent 函数，这个函数可以给所有的对象都动态安装发布—订阅功能
var installEvent = function(obj){
	for(var i in event){
		obj[i] = event[i]
	}
}


var salesOffices = {}
installEvent(salesOffices)

salesOffices.listen('squareMeter88',function(price){
	console.log('price = ' + price )
})

salesOffices.listen('squareMeter110',function(price){
	console.log('price = ' + price )
})

salesOffices.trigger(200000,10)
salesOffices.trigger(3000000,100)

//取消订阅的事件
event.remove = function(key,fn){
	var fns = this.clientList[key];

	if(!fns) return false;
	if(!fn){ // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
		fns && fns.length = 0;
	}else{
		for(var l=fns.length -1 ;l>0;l--){ // 反向遍历订阅的回调函数列表
			var _fn = fns[l];
			if(_fn === fn){
				fns.splice(l,1) // 删除订阅者的回调函数
			}
		}
	}
}

salesOffices.remove( 'squareMeter88', fn1 );


//网站登录
/*
login.succ(function(data){ 
header.setAvatar( data.avatar); // 设置 header 模块的头像 
nav.setAvatar( data.avatar ); // 设置导航模块的头像
message.refresh(); // 刷新消息列表
cart.refresh();// 刷新购物车列表
address.refresh();
});
*/

$.ajax('http://xxx.com?login',function(data){
	login.trigger('loginSuccess',data);
})

//各个模块监听登录成功的消息
var header = (function(){
	login.listen('loginSuccess',function(data){
		header.setAvatar( data.avatar); 
	});
	return {
		setAvatar:function(data){
			console.log('设置header 模块的头像')
		}
	}
})()

var nav = (function(){
	login.listen('loginSuccess',function(data){
		nav.setAvatar(data.avatar);
	})
	return {
		setAvatar:function(avatar){
			console.log('设置 nav 模块的头像')
		}
	}
})()

var address = (function(){
	login.listen('loginSuccess',function(obj){
		address.refresh();
	})
	return {
		refresh:function(avatar){
			console.log('刷新收获地址列表')
		}
	}
})()

//全局发布 - 订阅对象
/*
发布—订阅模式可以用一个全局的 Event 对象来实现，订阅者不需要了解消 
息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，
Event 作为一个类似“中介者” 的角色，把订阅者和发布者联系起来
*/
var Event = (function(){
	var clientList = {};
	var listen;
	var trigger;
	var remove;

	listen = function(key,fn){
		if(!clientList[key]){
			clientList[key] = []
		}
		clientList[key].push(fn);
	};

	trigger = function(){
		var key = [].shift.call(arguments);
		var fns = clientList[key];
		if(!fns || fns.length === 0){
			return false;
		}
		for(var i = 0,fn;fn = fns[i++];){
			fn.apply(this,arguments)
		}
	};	

	remove = function(key,fn){
		var fns = clientList[key]
		if(!fns){
			return false;
		}
		if(!fn){
			fns &&  fns.length = 0;
		}else{
			for(var l = fns.length - 1; l >= 0;l--){
				var _fn = fns[l];
				if(_fn === fn){
					fns.splice(l,1)
				}
			}
		}
	}

	return {
		listen:listen,
		trigger:trigger,
		remove:remove
	}

})()

Event.listen('squareMeter88',function(price){ // 小红订阅消息
	console.log('price = ' + price )
})

Event.trigger('squareMeter88',200000); // 售楼处发布消息

//模块间的通信
var a = (function(){
	var count = 0;
	var button = document.getElementById('count')
	button.onclick = function(){
		Event.trigger('add',count++)
	}
})()

var b = (function(){
	var div = document.getElementById('show')
	Event.listen('add',function(count){
		div.innerHTML = count;
	})
})()

//必须先订阅后发布，也可以先发布后订阅
//离线qq信息 一个存放离线事件的堆栈

//全局事件的命名冲突
Event.trigger('click',1)
Event.listen('click',function(a){console.log(a)})

Event.create('namespace1').listen('click',function(a){console.log(a)})
Event.create('namespace2').trigger('click',1)

var Event = (function(){
	var global = this;
	var Event;
	var _default = 'default'

	Event = function(){
		var _listen,
		    _trigger,
		    _remove,
		    _slice = Array.prototype.slice,
		    _shift = Array.prototype.shift,
		    _unshift = Array.prototype.unshift,
		    _namespaceCache = Array.prototype.unshift,
		    _create,
		    find,
		    each = function(array,fn){
		    	var ret;
		    	for(var i=0;i<array.length;i++){
		    		var n = array[i];
		    		ret = fn.call(n,i,n)
		    	}
		    	return ret;
		    };

		    _listen = function(key,fn,cache){
		    	if(! cache[key]){
		    		cache[key] = []
		    	}
		    	cache[key].push(fn)
		    }

		    _remove = function(key,cache,fn){
		    	if(cache[key]){
		    		if(fn){
		    			for(var i=cache[key].length;i>=0;i--){
		    				if(cache[key][i] === fn){
		    					cache[key].splice(i,1)
		    				}
		    			}
		    		}else{
		    			cache[key] = []
		    		}
		    	}
		    };

		    _trigger = function(){
		    	var cache = _shift.call(arguments);
		    	var key = _shift.call(arguments);
		    	var args = arguments;
		    	var _self = this;
		    	var ret;
		    	var stack = cache[key]

		    	if(!stack || stack.length){
		    		return;
		    	}

		    	return each(stack,function(){
		    		return this.apply(_self,args)
		    	})
		    };

		    _create = function(namespace){
		    	var namespace = namespace || _default;
		    	var cache = {}
		    	var offlineStack = []
		    	var ret = {
		    		listen:function(key,fn,last){
		    			_listen(key,fn,cache);
		    			if(offlineStack === null){
		    				return;
		    			}
		    			if(last === 'last'){
		    				offlineStack.length && offlineStack.pop()();
		    			}else{
		    				each(offlineStack,function(){
		    					this();
		    				})
		    			}
		    		},

		    		one:function(key,fn,last){
		    			_remove(key,cache)
		    			this.listen(key,fn,last)
		    		},

		    		remove:function(key,fn){
		    			_remove(key,cache,fn)
		    		},

		    		trigger:function(){
		    			var fn,args,_self = this;
		    			_unshift.call(arguments,cache);
		    			args = arguments;
		    			fn = function(){
		    				return _trigger.apply(_self,args);
		    			}

		    			if(offlineStack){
		    				return offlineStack.push(fn)
		    			}
		    			return fn()
		    		}
		    	};

		    	return namespace ? (
		    			_namespaceCache[namespace] ? _namespaceCache[namespace]:
		    			_namespaceCache[namespace]= ret
		    		):ret;
		    };

		    return {
		    	create:_create,
		    	one:function(key,fn,last){
		    		var event = this.create();
		    		event.one(key,fn,last)
		    	},
		    	remove:function(key,fn){
		    		var event = this.create()
		    		event.remove(key,fn)
		    	},
		    	listen:function(key,fn,last){
		    		var event = this.create();
		    		event.listen(key,fn,last)
		    	},
		    	trigger:function(){
		    		var event = this.create();
		    		event.trigger.apply(this,arguments)
		    	}
		    }	
	}()

	return Event;
})()

