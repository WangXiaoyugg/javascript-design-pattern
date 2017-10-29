//代码重构

//提炼函数
//1. 避免出现超大函数
//2. 独立出来函数有助于代码复用
//3. 独立出来的函数更容易被复写
//4. 独立出来的函数如果拥有一个良好的命名，它本身起到了注释的作用

var getUserInfo = function () {
	ajax('xxx.com/userinfo',function(data){
		console.log('userId',data.userId);
		console.log('username',data.username);
		console.log('nickname',data.nickname);
	})
}

//改成
var getUserInfo = function(){
	ajax('xxx.com/userinfo',function(data){
		printDetails(data);
	})
}

var printDetails = function(data){
	console.log('userId',data.userId);
	console.log('username',data.username);
	console.log('nickname',data.nickname);
}

//合并重复的条件片段
var paging = function(currPage){
	if(currPage <= 0){
		currPage = 0;
		jump(currPage);
	}else if (currPage >= totalPage){
		currPage = totalPage;
		jump(currPage);
	}else {
		jump(currPage);
	}
}

//改成
var paging = function(currPage){
	if(currPage <= 0){
		currPage = 0;
	}else if(currPage >= totalPage){
		currPage = totalPage;
	}
	jump(currPage);
}

// 把条件分支语句提炼成函数
var getPrice = function(price){
	var date = new Date();
	if(date.getMonth() >= 5 && date.getMonth() <= 8){ //夏天
		return price * 0.8;
	}
	return price;
}

//改写
var isSummer = function(){
	var date = new Date();
	return date.getMonth() >= 5 && date.getMonth() <= 8;
}

var getPrice = function(price){
	if(isSummer()){
		return price * 0.8;
	}
	return price;
} 


//合理使用循环
//ie9 以下的ie 浏览器
var createXHR = function(){
	var xhr;
	try {
		xhr = new ActiveXObject('MSXML2.XMLHttp.6.0');
	}catch(e){
		try{
			xhr = new ActiveXObject('MSXML2.XMLHttp.3.0')
		}catch(e){
			xhr = new ActiveXObject('MSXML2.XMLHttp')
		}
	}
	return xhr;
}

var xhr = createXHR();

//改写成
var createXHR = function(){};
var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'];
for(var i=0,version;version = versions[i++];){
	try{
		return new ActiveXObject(version);
	}catch(e){

	}
}

// 提前让函数退出代替嵌套条件分支
var del = function(obj){
	var ret;
	if(!obj.isReadOnly){
		if(obj.isFolder){
			ret = deleteFolder(obj);
		}else if (obj.isFile){
			ret = deleteFile(obj);
		}
	}
	return ret;
}

//改写成
var del = function(obj){
	if(obj.isReadOnly){// 反转 if 表达式
		return; 
	}
	if(obj.isFolder){
		return deleteFolder(obj);
	}
	if(obj.isFile){
		return deleteFile(obj);
	}
}


// 传递对象参数代替过长的参数列表
var setUserInfo = function(id,name,address,sex,mobile,qq){
	console.log('id',id);
	console.log('name',name);
	console.log('address',address);
	console.log('sex',sex);
	console.log('mobile',mobile);
	console.log('qq',qq);
}

setUserInfo(001,'seve','hefei','male','182********',88990011);

//改写成 
var setUserInfo = function(obj){
	console.log('id',obj.id);
	console.log('name',obj.name);
	console.log('address',obj.address);
	console.log('sex',obj.sex);
	console.log('mobile',obj.mobile);
	console.log('qq',obj.qq);
}

setUserInfo({
	id:1234,
	name;'seve',
	address:'hefei',
	sex:'male',
	mobile:'137**********',
	qq:88990011
})

//尽量减少参数数量
var draw =	function(width,height,square){}

//改成
var draw = function(width,height){
	var square = width * height ;
}

//少用三目运算符,提高代码的可读性
var global = typeof window !== 'undefined' ? window:this;

if(!aup || !bup){ //可读性太差，bad
	return a === doc ? -1 :
		b === doc ? 1:
		aup ? -1:
		bup ? 1:
		sortInput ?
		(indexOf.call(sortInput,a) - indexOf.call(sortInput,b)):
		0;
}

//合理的使用链式调用
//缺点，调试困难
var User = function(){
	this.id = null;
	this.name = null;
}

User.prototype.setId = function(id){
	this.id = id;
	return this;
};

User.prototype.setName = function(name){
	this.name = name;
	return this;
};
console.log(new User().setId(1234).setName('even'));

//或者
var User = {
	id:null,
	name:null,
	setId:function(id){
		this.id = id;
		return this;
	},
	setName:function(name){
		this.name = name;
		return this;
	}
}
console.log(User().setId(1234).setName('even'));

//分解大型类
var Spirit = function(name){
	this.name = name;
}

Spirit.prototype.attack = function(type){
	if(type === 'waveBoxing'){
		console.log(this.name+': 使用波动拳');
	}else if(type === 'whirlKick'){
		console.log(this.name+': 使用旋风腿');
	}
}

var spirit = new Spirit('RYU');

spirit.attack('waveBoxing');
spirit.attack('whirlKick');

//分解成更小的类,把攻击方式委托给Attack类
var Attack = function(spirit){
	this.spirit = spirit;
}

Attack.prototype.start = function(type){
	return this.list[type].call(this);
};

Attack.prototype.list = {
	waveBoxing:function(){
		console.log(this.spirit.name+': 使用波动拳');
	},
	whileKick:function(){
		console.log(this.spirit.name+': 使用旋风腿');
	}
}

var Spirit = function(name){
	this.name = name;
	this.attackObj = new Attack(this);
}

Spirit.prototype.attack = function(type){
	this.attackObj.start(type);
}

var spirit = new Spirit('RYU');

spirit.attack('waveBoxing');
spirit.attack('whirlKick');

//用 return 推出多重循环
// 要在内层循环中判断，当达到某个临界条件时
// 退出外层的循环。我们大多数时候会引入一个控制标记变量
var func = function(){
	var flag = false;
	for(var i=0;i<10;i++){
		for(var j=0;j<10;j++){
			if(i*j > 30){
				flag = true;
				break;
			}
		}
		if(flag === true){
			break;
		}
	}
}
//第二种方法设置循环标记
var func = function(){
	outerloop;
	for(var i=0;i<10;i++){
		innerloop;
		for(var j=0;j<10;j++){
			if(i*j > 30){
				break outerloop;
			}
		}
	}
}

// 需要中止循环的时候直接退出整个方法
var func = function(){
	for(var i=0;i<10;i++){
		for(var j=0;j<10;j++){
			if(i*j > 30){
				return;
			}
		}
	}
}

// 循环之后还有一些将被执行的代码?
var func = function(){
	for(var i=0;i<10;i++){
		for(var j=0;j<10;j++){
			if(i *j > 30){
				return;
			}
		}
	}
	console.log(1)//没有被执行
}

// 为了解决这个问题，我们可以把循环后面的代码放到 return 后面，如果代码比较多，就应
// 该把它们提炼成一个单独的函数

var print = function(i){
	console.log(i);
}

var func = function(){
	for(var i=0;i<10;i++){
		for(var j=0;j<10;j++){
			if(i *j > 30){
				return print(i);
			}
		}
	}
}

func();
































