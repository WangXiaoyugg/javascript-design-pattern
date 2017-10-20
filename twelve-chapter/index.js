//享元(flyweight)模式是一种用于性能优化的模式，
//多个模特穿多种内衣拍照



//内部状态和外部状态
// 享元模式的目标是尽量减少共享对象的数量，
// 关于如何划分内 部状态和外部状态，
// 下面的几条经验提供了一些指引
/*
 内部状态存储于对象内部。
 内部状态可以被一些对象共享。
 内部状态独立于具体的场景，通常不会改变。
 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享
*/

// 只有当某种共享对象被真正需要时，它才从工厂 中被创建出来。
//可以用一个管理器来记录对象相关的外部状态，使这些外部状 态通过某个钩子和共享对象联系起来

//文件说上传
var id = 0;
window.startUpload = function (uploadTypes,files) {
	for(var i=0,file;file=files[i++];){
		var uploadObj = new upload(uploadType,file.fileName,file.fileSize);
		uploadObj.init(id++);
	}
}

var Upload = function(uploadObj,fileName,fileSize){
	this.uploadObj = uploadObj
	this.fileName = fileName
	this.fileSize = fileSize
	this.dom = null
}

Upload.prototype.init = function(id){
	var that = this;
	this.id = id;
	this.dom = document.createElement('div')
	this.dom.innerHTML = 
	'<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' + '<button class="delFile">删除</button>';
	this.dom.querySelector('.delFile').onclick = function(){
		this.delFile();
	}
	document.body.appendChild(this.dom)
}

Upload.prototype.delFile = function(){
	if(this.fileSize < 3000){
		return this.dom.parentNode.removeChild(this.dom)
	}

	if(window.confirm('确定要删除该文件吗？ '+ this.fileName)){
		return this.dom.parentNode.removeChild(this.dom)
	}
}

startUpload( 'plugin', [ {
	fileName: '1.txt',
	fileSize: 1000 
},
{
	fileName: '2.html', fileSize: 3000
	
}, 6 
{
	fileName: '3.txt',
	fileSize: 5000 
}
]);

startUpload( 'flash', [ {
	fileName: '4.txt',
	fileSize: 1000 
},
{	
	fileName: '5.html',
	fileSize: 3000 
},
{
	fileName: '6.txt', 
	fileSize: 5000
} 
]);


/*享元模式重写*/
//剥离外部状态
var Upload = function(uploadType){
	this.uploadObj = uploadTypes;
}

Upload.prototype.delFile = function(id){
	uploadManger.setExternalState(id,this); //把当前 id 对应的对象的外部状态都组装到共享对象中

	if(this.fileSize < 3000){
		return this.dom.parentNode.removeChild(this.dom)
	}

	if(window.confirm('确定要删除该文件吗？ '+ this.fileName)){
		return this.dom.parentNode.removeChild(this.dom)
	}
}

//工厂实例化
var UploadFactory = (function(){
	var createdFlyWeightObjs = {};

	return {
		create:function(uploadType){
			if(createdFlyWeightObjs[uploadType]){
				return createdFlyWeightObjs[uploadTypes]
			}

			return createdFlyWeightObjs[uploadType] = new UploadFactory(uploadType)
		}
	}
})()

//管理器封装外部状态
var uploadManager = (function(){
	var uploadDatabase = {};

	return {
		add:function(id,uploadType,fileName,fileSize){
			var flyweightObj = UploadFactory.create(uploadType)
			
			var dom = document.createElement('div')
			this.dom.innerHTML = 
			'<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' + '<button class="delFile">删除</button>';
			dom.querySelector('.delFile').onclick = function(){
				flyweightObj.delFile(id);
			}

			document.body.appendChild(dom);

			uploadDatabase[id] = {
				fileName:fileName,
				fileSize:fileSize,
				dom:dom,
			}
			return flyweightObj;
		},
		setExternalState:function(id,flyweightObj){
			var uploadData = uploadDatabase[id];
			for(var  i in uploadData){
				flyweightObj[i] = uploadData[i];
			}
		}

	}
})()

// 是开始触发上传动作的 startUpload 函数
var id = 0;
window.startUpload = function(uploadType,files){
	for(var i = 0,file;file= files[i++];){
		var uploadObj = uploadManager.add(++id,uploadType,file.fileName,file.fileSize)
	}
}

// 创建的 upload 对象数量依然是 2

/*使用场景
 对象的大多数状态都可以变为外部状态。 
 一个程序中使用了大量的相似对象。
 由于使用了大量对象，造成很大的内存开销。
 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象
*/

// 对象池维 护一个装载空闲对象的池子，如果需要对象的时候，不是直接 new，
// 而是转从对象池里获取。如 果对象池里没有空闲对象，则创建一个新的对象，
// 当获取出的对象完成它的职责之后， 再进入 池子等待被下次获取
// 对象池 类比 图书馆
// web 应用 HTTP 连接池 数据库连接池，对象池使用最多的场景大概就是跟 DOM 有关的操作


var toolTipFactory = (function(){
	var toolTipPool = [];//对象池
	return {
		create:function(){
			if(toolTipPool.length === 0){ // 如果对象池为空
				var div = document.createElement('div') //创建一个dom
				document.body.appendChild(div)
				return div ;
			}else{ // 如果对象池不为空
				return toolTipPool.shift();//则从对象池中取出一个dom
			}
		},
		recover:function(toolTipDom){
			return toolTipPool.push(toolTipDom) //对象池回收dom
		}
	}
})()


var array = [];
for(var i=0,str;str = ['A','B'][i++];){
	var toolTip = toolTipFactory.create();
	toolTip.innerHTML = str;
	array.push(toolTip);
}
// a, b dom节点收回对象池
for(var i=0,toolTip;toolTip = array[i++];){
	toolTipFactory.recover(toolTip);
}

//在创建6个小气泡
for(var i=0,str;str=['A','B','C','D','E','F'][i++];){
	var toolTip = toolTipFactory.create()
	toolTip.innerHTML = str;
}

//通用的对象池实现
var objectPoolFactory = function(createObjFn){
	var objectPool = [];

	return {
		create:function(){
			var obj = objectPool.length === 0 ?
			createObjFn.apply(this,arguments):objectPool.shift();
		},
		recover:function(obj){
			objectPool.push(obj);
		}
	}
}

var iframeFactory = objectPoolFactory(function(){
	var iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	iframe.onload = function(){
		iframe.onload = null ;//防止 iframe 重复加载的 bug
		iframeFactory.recover(iframe);// iframe 加载完成之后回收节点
	}
	return iframe;
})

var iframe1 = iframeFactory.create(); iframe1.src = 'http:// baidu.com';
var iframe2 = iframeFactory.create(); iframe2.src = 'http:// QQ.com';
setTimeout(function(){
	var iframe3 = iframeFactory.create();
	iframe3.src = 'http:// 163.com'; 
}, 3000 );

// 对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，
// 但没有分离内部状态和外 部状态这个过程


//没有内部状态的享元模式
//不需要考虑极速上传与普通上传之间的切换
var Upload = function(){};
var UploadFactory = (function(){
	var uploadObj;
	return {
		create:function(){
			if(uploadObj){
				return uploadObj;
			}
			return uploadObj = new Upload();
		}
	}
})()

