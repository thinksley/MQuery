/**
  *name:getByClass   通过样式名获取元素对象
  *@param {String}   [oPar]  父集元素对象
  *@param {String}   [sClass]   类名称
*/
function getByClass(oPar,sClass)
{
  var alls=oPar.getElementsByTagName('*');
  var results=[];
  for(var i=0;i<alls.length;i++)
  {
	  if(alls[i].className==sClass)
	  {
		 results.push(alls[i]);  
	  }  
  }
  return results;
}
/**
  *name:myAddEvent   事件封装
  *@param {Object}   [obj]   对象
  *@param {String}   [oEv]   事件类型
  *@param {function} [fn]    执行的函数
*/
function myAddEvent(obj,oEv,fn)
{
    if(obj.attachEvent)
  	{
	  obj.attachEvent('on'+oEv,function(){
		    if(false==fn.call(obj))
			{
			  event.concelBubble=true;//取消事件冒泡
			  return false;   //ie下阻止默认事件
			}
		  });	
	}else
	{
	  obj.addEventListener(oEv,function(ev){
		    if(false==fn.call(obj))
			{
			  event.concelBubble=true;//取消事件冒泡
			  ev.preventDefault();//moz webkit 下阻止默认事件
			}
		  },false);	
	}
}

/**
  *name:getStyle      获取样式
  *@param {Object}   [obj]   对象
  *@param {String}   [attr]  css属性
*/
function getStyle(obj,attr)
{
   if(obj.currentStyle)
   {
	 return obj.currentStyle[attr];   
   }else
   {
     return getComputedStyle(obj,false)[attr];
   }
}

/**
  *name:MQuery      选择器
  *@param {String,Object,function}   [vArg]   输入id(包括'#'),class(包括'.'),标签,对象,函数
 
*/
function MQuery(vArg)
{
	//保存选中元素
	this.elements=[];
    switch(typeof vArg)
	{
	  case 'function':
	        myAddEvent(window,'load',vArg);
			break;
	  case 'string':
	        switch(vArg.charAt(0))
			{
			   case '#':
			       var obj=document.getElementById(vArg.substring(1));                  
				   this.elements.push(obj);
			       break;
			   case '.':
			       this.elements=getByClass(document,vArg.substring(1));
			       break;
			   default:
			      this.elements=document.getElementsByTagName(vArg);
			}
			break;
	  case 'object':
	      this.elements.push(vArg);
	}	
}

/**
  *name:click          单击事件
  *@param {function}   [fn]   执行的事件
*/
MQuery.prototype.click=function(fn)
{
  	for(var i=0;i<this.elements.length;i++)
	{
	  myAddEvent(this.elements[i],'click',fn);	
	}
	return this;
}

/**
  *name:show        元素显示
*/
MQuery.prototype.show=function()
{
    for(var i=0;i<this.elements.length;i++)
	{
	  this.elements[i].style.display='block';	
	}
	return this;
}

/**
  *name:hide        元素隐藏
*/
MQuery.prototype.hide=function()
{
    for(var i=0;i<this.elements.length;i++)
	{
	  this.elements[i].style.display='none';	
	}
	return this;
}

/**
  *name:hover            鼠标移上和移去
  *@param {function}     [fnOver]     鼠标移动上去的事件
  *@param {function}     [fnOut]      鼠标移开的事件
*/
MQuery.prototype.hover=function(fnOver,fnOut)
{
  	for(var i=0;i<this.elements.length;i++)
	{
	  myAddEvent(this.elements[i],'mouseover',fnOver);
	  myAddEvent(this.elements[i],'mouseout',fnOut);
	}
	return this;
}

/**
  *name:css             获取css和设置css
  *@param {String}     [attr]          属性
  *@param {String}     [value]         值，可有可无，当无时表示获取css值，写了表示重置css值
*/
MQuery.prototype.css=function(attr,value)
{
    if(arguments.length==2) //设置样式
	{
	   
	    for(var i=0;i<this.elements.length;i++)
		{
		  this.elements[i].style[attr]=value;
		}
	}else //获取样式
	{
	    if(typeof attr=='string')
		{
	       return getStyle(this.elements[0],attr);
		}else
		{
		  for(var i=0;i<this.elements.length;i++)
		  {
			 var k='';
			 for(k in attr)
			 {
			   this.elements[i].style[k]=attr[k];
			 }  
		  }
		}
	}
	return this;
}

/**
  *name:css              获取css和设置css
  *@param {String}       [attr]          属性
  *@param {String}       [value]         值，可有可无，当无时表示获取css值，写了表示重置css值
*/
MQuery.prototype.attr=function(attr,value)
{
    if(arguments.length==2) //设置
	{
	  for(var i=0;i<this.elements.length;i++)
	  {
	    this.elements[i][attr]=value;
	  }	
	}else
	{
	  return this.elements[0][attr];	
	}
	return this;
}

/**
  *name:toggle              单击一次就轮流执行里面的参数函数
  *@param {function}
*/
MQuery.prototype.toggle=function()
{
	var _arguments=arguments;
    for(var i=0;i<this.elements.length;i++)
	{
	    addToggle(this.elements[i]);
	}
	function addToggle(obj)
	{
	  var count=0;
	  myAddEvent(obj,'click',function(){
		    _arguments[count++%_arguments.length].call(obj);
		 });
	}
	return this;
}

/**
  *name:eq              获取第几个元素
  *@param {Number}      [n]
*/
MQuery.prototype.eq=function(n)
{
   return $(this.elements[n]);
}

/**
  *name:appendArr            for MQuery.prototype.find
*/
function appendArr(arr1,arr2)
{
  for(var i=0;i<arr2.length;i++)
  {
	  arr1.push(arr2[i]);  
  }
}

/**
  *name:find     查找元素
  *@param {String}  [str]  类名包括'.'  或标签
*/
MQuery.prototype.find=function(str)
{
   var aResult=[];
   for(var i=0;i<this.elements.length;i++)
	{
	    switch(str.charAt(0))
		{
		  case '.': //class
		      	var aEle=getByClass(this.elements[i],str.substring(1));
				aResult=aResult.concat(aEle);
		  default: //标签
		      var aEle=this.elements[i].getElementsByTagName(str);
			  appendArr(aResult,aEle);
			  //aResult=aResult.concat(aEle);
		}
	}
	var newMQuery=$();
	newMQuery.elements=aResult;
	return newMQuery;
}

/**
  *name:getIndex            for MQuery.prototype.index
*/
function getIndex(obj)
{
   var oBrother=obj.parentNode.children;
   for(var i=0;i<oBrother.length;i++)
   {
	  if(oBrother[i]==obj)
	  {
	     return i;
	  }  
   }	
}

/**
  *name:index       查找同行子元素的索引号
*/
MQuery.prototype.index=function()
{
   	return getIndex(this.elements[0]);
}

/*******************/
/*使用bind时候要想阻止默认事件和事件冒泡的话 得加return false；其具体方法实现在myAddEvent里面实现
 *name: bind          绑定事件
 *@param {String}     [sEv]   事件名称
 *@param {function}   [fn]    执行的函数
*/
/*******************/

MQuery.prototype.bind=function(sEv,fn)
{
   for(var i=0;i<this.elements.length;i++)
   {
      myAddEvent(this.elements[i],sEv,fn);
   }
}
/*******************/
/*//插件写法
  $().extend('size',function(){ 
	  return this.elements.length;
	});
	直接在原型上添加了size方法
*/
/*******************/
MQuery.prototype.extend=function(name,fn) //插件机制
{
  MQuery.prototype[name]=fn;
}

/**
实例化一个MQuery对象
如：$('#div');  $('.class');  $(function(){alert('hello world')});  $('div');
*/
function $(vArg)
{
  return new MQuery(vArg);
}
