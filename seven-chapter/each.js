// 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，
// 而又不需要暴露该对象的内部表示。
// 迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，
// 迭代器模式，使不关心对象的内部构造，也可以按顺序访问其中的每个元素

// each (array,callback)

var each = function (array,calback) {
	for(var i=0;i<array.length;i++){
		callback.call(array,i,array[i])
	}
}

each([1,2,3,4],function(i,n){
	console.log([i,n]);
})

//内部迭代器，外部迭代器
//each 函数属于内部迭代器，each 函数的内部已经定义好了迭代规则
//由于内部迭代器的迭代规则已经被提前规 定，上面的 each 函数就无法同时迭代 2 个数组了

var compare = function(array1,array2){
	if(array1.length !== array2.length){
		throw new Error('array1 array2 not equal')
	}

	each(array1,function(i,n){
		if(n !== array2[i]){
			throw  new Error('array1 array2 not equal')
		}
	})

	console.log('array1 array2 equal')
}

//外部迭代器 
// 外部迭代器必须显式地请求迭代下一个元素
// 外部迭代器增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，我们可以手工控制 迭代的过程或者顺序

var Iterator = function(obj){
	var current = 0;
	var next = function(){
		current +=1;
	}

	var isDone = function(){
		return current > obj.length;
	}

	var getCurrItem = function(){
		return obj[current]
	}

	return {
		next:next,
		isDone:isDone,
		getCurrItem:getCurrItem
	}
}

var compare = function(iterator1,iterator2){
	while(!iterator1.isDone() && !iterator2.isDone()){
		if(iterator1.getCurrItem() !== iterator2.getCurrItem()){
			throw new Error('iterator1 iterator2 not equal')
		}

		iterator1.next()
		iterator2.next()
	}
	console.log('iterator1 iterator2 equal')
}

var iterator1 = Iterator([1,2,3])
var iterator2 = Iterator([1,2,3])

compare(iterator1,iterator2)


//迭代数组对象和字面量对象
// 迭代的聚合对象拥有 length 属性而且可以用下标访问，那它就可以被迭代
$.each = function(obj,callback){
	var value,
	    i = 0,
	    length = obj.length,
	    isArray = isArrayLike(obj);

	if(isArray){
		for(;i<length;i++){
			value = callback.call(obj[i],i,obj[i])

			if(value === false){
				break;
			}
		}
	}else{
		for(i in obj){
			value = callback.call(obj[i],i,obj[i]);
			if(value === false){
				break;
			}
		}
	}
	return obj;    
}

//倒序迭代器
var reverseEach = function(array,callback){
	for(var l= array.length -1 ; l>=0; l--){
		callback.call(array,l,array[l])
	}
}

reverseEach( [ 0, 1, 2 ], function( i, n ){ 
	console.log( n ); // 分别输出:2, 1 ,0
});

//中止迭代器
var each = function(array,callback){
	for(var i=0;i<array.length;i++){
		if(callback.call(array,i,array[i]) === false){
			break;
		}
	}
}

each([1,2,3,4,5],function(i,n){
	if(n > 3){
		return false;
	}
	console.log(n);
})

//迭代器应用举例
// 根据不同的浏览器获取相应的上传组件对象

var getUploadObj = function(){
	try{
		return new ActiveXObject('TXFINActiveX.FTNUpload')
	}catch(e){
		if(supportFlash()){
			var str = '<object type="application/x-shockwave-flash"></object>'
			return  $(str).appendTo($('body'))
		}else{
			var str = '<input name="file" type="file"  />'
			return $(str).appendTo($('body'))
		}
	}

}

//我们把每种获取 upload 对象的方法都封装在各自的函数里，
// 然后使用一个迭代器， 迭代获取这些 upload 对象，直到获取到一个可用的为止
var getActiveUploadObj = function(){
	try{
		return new ActiveXObject('TXFINActiveX.FTNUpload')
	}catch(e){
		return false;
	}
}

var getFlashUploadObj = function(){
	if(supportFlash()){
		var str = '<object type="application/x-shockwave-flash"></object>'
			return  $(str).appendTo($('body'))
	}
	return false;
}

var getFormUploadObj = function(){
	var str = '<input name="file" type="file"  />'
	return $(str).appendTo($('body'))
}

var iteratorUploadObj = function(){
	for(var i=0,fn;fn=[arguments[i++]];){
		var uploadObj = fn()
		if(uploadObj !== false){
			return uploadObj;
		}
	}
}

var getWebkitUploadObj = function(){};
var getHtml5UploadObj = function(){};

var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj );

