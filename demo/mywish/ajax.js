//版权 北京智能社©, 保留所有权利
//options	==url,data,type,timeout,success,error
function ajax(options){
	options=options||{};
	options.data=options.data||{};
	options.type=options.type||'get';
	options.timeout=options.timeout||0;
	options.success=options.success||null;
	options.error=options.error||null;
	
	
	options.data.t=Math.random();
	
	//0.整理接口
	var arr=[];
	for(var key in options.data){
		arr.push(key+'='+encodeURIComponent(options.data[key]))	
	}
	var str=arr.join('&');
	
	
	//1创建ajax对象
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();	
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');	
	}
	if(options.type=='get'){
		//2.连接
		oAjax.open('get',options.url+'?'+str,true);
		//3.请求
		oAjax.send();	
	}else{
		//2.连接
		oAjax.open('post',options.url,true);
		//oAjax.setRequestHeader('属性',值)
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');	//设定头信息
		//3.请求	
		oAjax.send(str);		//post在这里传数据
	}
	//4.接收
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			clearTimeout(timer);
			if(oAjax.status>=200&oAjax.status<300||oAjax.stauts==304){
				options.success&&options.success(oAjax.responseText);
			}else{
				options.error && options.error(oAjax.status);
			}
			
		}
	};
	if(options.timeout){
		var timer=setTimeout(function(){
			alert('超时了');
			oAjax.abort();	//中断加载
			
		},options.timeout);	
	}
}