function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}
function startMove(obj,json,options){
	options=options || {};
	options.time=options.time || 700;
	options.type=options.type || 'ease-out';
	
	var count=Math.floor(options.time/30);
	
	var start={};
	var dis={};
	
	for(var name in json){
		if(name=='opacity'){
			start[name]=Math.round(parseFloat(getStyle(obj,name))*100);
		}else{
			start[name]=parseInt(getStyle(obj,name));	
		}
		
		dis[name]=json[name]-start[name];
	}
	
	var n=0;
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var name in json){
			
			switch(options.type){
				case 'linear':
					var a=n/count;
					var cur=start[name]+dis[name]*a;
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-a*a*a);
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*(a*a*a);
					break;
			}
			
			if(name=='opacity'){
				obj.style.opacity=cur/100;
				obj.style.filter='alpha(opacity:'+cur+')';
			}else{
				obj.style[name]=cur+'px';	
			}
		}
		
		if(n==count){
			clearInterval(obj.timer);
			options.end && options.end();	
		}
	},30);
}
//----------------------------------------------------
var zIndex=2;
function drag(oDiv,obj){
	oDiv.onmousedown=function(ev){
		var oEvent=ev || event;
		
		var disX=oEvent.clientX-obj.offsetLeft;
		var disY=oEvent.clientY-obj.offsetTop;
		obj.style.zIndex=zIndex++;
		obj.style.opacity=0.4;
		obj.style.filter='alpha(opacity:40)';
		
		document.onmousemove=function(ev){
			var oEvent=ev || event;
			
			obj.style.left=oEvent.clientX-disX+'px';
			obj.style.top=oEvent.clientY-disY+'px';	
		}
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;	
			oDiv.releaseCapture && oDiv.releaseCapture();
			obj.style.opacity=1;
			obj.style.filter='alpha(opacity:100)';
		}
		oDiv.setCapture && oDiv.setCapture();
		return false;	
	}	
}
function rnd(n,m){
	return parseInt(Math.random()*(m-n)+n);
}

//功能性的
//点击我要许愿
function myWish(){
	var oBtn=document.getElementById('send');
	var oBox=document.getElementById('send-form');
	
	oBox.style.opacity=0;
	oBox.style.filter='alpha(opacity:0)';
	
	oBtn.onclick=function(){
		oBox.style.display='block';
		oBox.style.left='50%';
		oBox.style.top='50%';
		oBox.style.marginLeft=-oBox.offsetWidth/2+'px';	
		oBox.style.marginTop=-oBox.offsetHeight/2+'px';
		
		startMove(oBox,{opacity:100});
		createLayer();
	};
	
	function createLayer(){
		var winW=document.documentElement.clientWidth;
		var winH=document.documentElement.clientHeight;
		var oDiv=document.createElement('div');
		oDiv.style.cssText='position:absolute; left:0; top:0; width:'+winW+'px; height:'+winH+'px; z-index:100; background:#000; opacity:0.3; filter:alpha(opacity:30);';
		
		document.body.appendChild(oDiv);	
	}		
}

//拖拽
function nowDrag(){
	var oBox=document.getElementById('main');
	var aDl=oBox.children;
	var aDt=oBox.getElementsByTagName('dt');
	
	var maxL=document.documentElement.clientWidth-aDl[0].offsetWidth;
	var maxT=document.documentElement.clientHeight-aDl[0].offsetHeight;
	
	for(var i=0; i<aDt.length; i++){
		drag(aDt[i],aDl[i]);
		
		aDl[i].onclick=function(){
			this.style.zIndex=zIndex++;	
		};
		
		//随机给位置
		aDl[i].style.left=rnd(0,maxL)+'px';
		aDl[i].style.top=rnd(0,maxT-126)+'px';
	}	
}	

//检测输入的字数
function checkWord(){
	var oCon=document.getElementById('content');
	var oFontNumber=document.getElementById('font-num');
	
	var timer=null;
	oCon.oninput=function(){
		clearInterval(timer);
		var n=50-oCon.value.length;
		if(n<=0){
			n=0;
			
			var i=0;
			timer=setInterval(function(){
				i++;
				if(i%2){
					oCon.style.background='#f60';	
				}else{
					oCon.style.background='#fff';
				}
				if(i==6){
					clearInterval(timer);	
				}	
			},100);
		}
		oFontNumber.innerHTML=n;	
	}	
}	

//点击表情
function clickFace(){
	var oBox=document.getElementById('phiz');
	var oCon=document.getElementById('content');
	var aImg=oBox.children;
	
	for(var i=0; i<aImg.length; i++){
		aImg[i].onclick=function(){
			oCon.value+='['+this.alt+']';	
		}
	}	
}

function filterFace(str,data){
	var data={
		'抓狂':'zhuakuang',
		'抱抱':'baobao',
		'害羞':'haixiu',
		'酷':'ku',
		'嘻嘻':'xixi',
		'太开心':'taikaixin',
		'偷笑':'touxiao',
		'钱':'qian',
		'花心':'huaxin',
		'挤眼':'jiyan'	
	}
	var newStr=str.replace(/\[[\u4e00-\u9fa5]+\]/g,function(s){
		s=s.substring(1,s.length-1);
		//alert(s);
		return '<img src="Images/phiz/'+data[s]+'.gif'+'" />';	
	});
	return newStr;
}	





















