/**
 *name:  setCookie  设置cookie
 *@param {String}   [name]   cookie名称
 *@param {String}   [value]  cookie值
 *@param {Number}   [iDay]   过期时间
*/
$().extend('setCookie',function(name,value,iDay){ 
      var date=new Date();
		date.setDate(date.getDate()+iDay);
		document.cookie=name+'='+value+';expires='+date;
});
/**
 *name:  getCookie  获取cookie
 *@param {String}   [name]   cookie名称
*/
$().extend('getCookie',function(name){ 
	  var arr=document.cookie.split('; ');
	  for(var i=0;i<arr.length;i++)
	  {
		  var temp=arr[i].split('=');
		  if(temp[0]==name)
		  {
			    return temp[1];
		  }
	  }
	  return '';
});

/**
 *name:removeCookie  删除cookie
 *@param {String}    [name]   cookie名称
*/
$().extend('removeCookie',function(name){ 
	    $().setCookie(name,'1',-1);
});
