/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-03-21 22:19:01
 * @version $Id$
 */
'use strict';
//move框架
function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}

function move(obj,json,options)
{
	//考虑默认值
	options=options || {};
	options.duration=options.duration || 500;
	options.easing=options.easing || 'ease-out';
	
	var count=Math.round(options.duration/30);
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'left':
					start[name]=obj.offsetLeft;
					break;
				case 'top':
					start[name]=obj.offsetTop;
					break;
				case 'width':
					start[name]=obj.offsetWidth;
					break;
				case 'height':
					start[name]=obj.offsetHeight;
					break;
				case 'marginLeft':
					start[name]=obj.offsetLeft;
					break;
				case 'borderWidth':
					start[name]=0;
					break;
				//...
			}
		}
		dis[name]=json[name]-start[name];
	}
	
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var name in json){
			switch(options.easing){
				case 'linear':
					var a=n/count;
					var cur=start[name]+dis[name]*a;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*a*a*a;
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-a*a*a);
					break;
			}
			
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		
		if(n==count){
			clearInterval(obj.timer);
			//添加call(obj)，把this指向为obj，是为了在调用的时候，能够直接使用this调用，而不会改变this 的指向
			options.complete && options.complete.call(obj);
		}
	},30);
}

var Tween={Linear:function(t,b,c,d){return c*t/d+b},Quad:{easeIn:function(t,b,c,d){return c*(t/=d)*t+b},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b}},Cubic:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b}},Quart:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b},easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b}},Quint:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b}},Sine:{easeIn:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOut:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b}},Expo:{easeIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOut:function(t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b}},Circ:{easeIn:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b}},Elastic:{easeIn:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b)},easeInOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b}},Back:{easeIn:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b}},Bounce:{easeIn:function(t,b,c,d){return c-Tween.Bounce.easeOut(d-t,0,c,d)+b},easeOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOut:function(t,b,c,d){if(t<d/2){return Tween.Bounce.easeIn(t*2,0,c,d)*0.5+b}else{return Tween.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b}}}};

function doMove(obj,json,options)
{
	options=options || {};
	options.duration=options.duration || 700;
	options.easing=options.easing || Tween.Elastic.easeInOut;
	
	var count=Math.round(options.duration/25);
	
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		
		dis[name]=json[name]-start[name];
	}
	
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var name in json){
			
			var cur=options.easing(n/count*options.duration,start[name],dis[name],options.duration);
			
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';	
			}else{
				obj.style[name]=cur+'px';	
			}
		}
		
		if(n==count){
			clearInterval(obj.timer);
			options.complete && options.complete.call(obj);	
		}
	},25);
}

// 事件绑定
function addEvent(obj,sEvent,fn)
{
	if(obj.addEventListener){
		obj.addEventListener(sEvent,fn,false);
	}else{
		obj.attachEvent('on'+sEvent,fn);
	}
}

// 操作class属性
function getByClass(obj,sClass)
{
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(sClass);
	}else{
		var arr=[];
		var reg=new RegExp('\\b'+sClass+'\\b');
		var aEle=obj.getElementsByTagName('*');
		for(var i=0;i<aEle.length;i++){
			if(reg.test(aEle[i].className)){
				arr.push(aEle[i]);
			}
		}
		return arr;
	}
}

function hasClass(obj,sClass)
{
	var reg=new RegExp('\\b'+sClass+'\\b');
	return reg.test(obj.className);
}

function addClass(obj,sClass)
{
	if(obj.className){
		if(!hasClass(obj,sClass)){
			obj.className+=' '+sClass;
		}
	}else{
		obj.className=sClass;
	}
}

function removeClass(obj,sClass)
{
	var reg=new RegExp('\\b'+sClass+'\\b','g');
	if(hasClass(obj,sClass)){
		obj.className=obj.className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
	}
}

// 获取元素的位置
function getPos(obj){
	var left=0;
	var top=0;
	while(obj){
		left+=obj.offsetLeft;
		top+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {l:left,t:top};
}

//滚轮事件
function addMouseWheel(obj,fn){
	if(window.navigator.userAgent.toLowerCase().indexOf('firefox')!=-1){
		obj.addEventListener('DOMMouseScroll',fnWheel,false);
	}else{
		addEvent(obj,'mousewheel',fnWheel);
	}

	function fnWheel(ev){
		var oEvent=ev||event;
		var bDown=true;
		bDown=oEvent.wheelDelta?oEvent.wheelDelta<0:oEvent.detail>0;
		fn&&fn(bDown);
		oEvent.preventDefault&&oEvent.preventDefault();
		return false;
	}
}

addEvent(window,'load',function(){
	// part-one
	function tab_scroll()
	{
		var oUl=document.getElementById('focus_cont');
		var oOl=document.getElementById('focus_btn');
		var aLi=oUl.children;
		var aBtn=oOl.children;
		var oPrev=document.getElementById('JS_prev');
		var oNext=document.getElementById('JS_next');
		var iNow=0;
		window.timer=null;
		for(var i=0;i<aBtn.length;i++){
			(function(index){
				aBtn[i].onmouseover=function(){
					iNow=index;
					tab();
					clearInterval(window.timer);
				}
				aBtn[i].onmouseout=function(){
					window.timer=setInterval(next,2000);
				}
			})(i);
		}
		
		function tab(){
			for(var i=0;i<aBtn.length;i++){
				aBtn[i].className='';
				move(aLi[i],{opacity:0},{duration:1000});
			}
			aBtn[iNow].className='selected';
			move(aLi[iNow],{opacity:1},{duration:1000});
		}
		oNext.onclick=next;
		function next(){
			iNow++;
			if(iNow==aLi.length){
				iNow=0;
			}
			tab();
		}

		oPrev.onclick=prev;
		function prev(){
			iNow--;
			if(iNow==-1){
				iNow=aLi.length-1;
			}
			tab();
		}

		window.timer=setInterval(next,2000);
		oPrev.onmouseover=oNext.onmouseover=function(){
			clearInterval(window.timer);
		};

		oPrev.onmouseout=oNext.onmouseout=function(){
			window.timer=setInterval(next,2000);
		};
	}
	
	tab_scroll();
	// part-two
	function over_show()
	{
		var oBox2=document.getElementById('JS_two_grids');
		var aItem=oBox2.children;
		for(var i=0;i<aItem.length;i++){
			(function(index){
				aItem[i].onmouseover=function(){
					var oDisc=this.children[0].children[1];
					move(oDisc,{bottom:0});			};
				aItem[i].onmouseout=function(){
					var oDisc=this.children[0].children[1];
					move(oDisc,{bottom:-130});
				}
			})(i);
		}
	}

	over_show();

	// part-three
	// 不添加onepage插件时，使用这个函数
	// addEvent(window,'scroll',function(){
	// 	var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
	// 	function hoverDir(obj,ev){
	// 		var y=getPos(obj).t+obj.offsetHeight/2-ev.clientY-scrollTop;
 // 			var x=getPos(obj).l+obj.offsetWidth/2-ev.clientX;
 // 			return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;
	// 	}

	// 	var oBox3=document.getElementById('JS_three_girds');
	// 	var aDiv=oBox3.children;
	// 	var aHide=getByClass(oBox3,'disc');

	// 	//布局转换
	// 	var aPos=[];
	// 	for(var i=0;i<aDiv.length;i++){
	// 		aPos[i]={top:aDiv[i].offsetTop,left:aDiv[i].offsetLeft,width:aDiv[i].offsetWidth,height:aDiv[i].offsetHeight};
	// 	}
	// 	for(var i=0;i<aDiv.length;i++){
	// 		aDiv[i].style.left=aPos[i].left+'px';
	// 		aDiv[i].style.top=aPos[i].top+'px';
	// 		aDiv[i].style.width=aPos[i].width+'px';
	// 		aDiv[i].style.height=aPos[i].height+'px';
	// 		aDiv[i].style.position='absolute';
	// 		aDiv[i].style.margin=0;
	// 	}

	// 	// 移入窗墙效果
	// 	for(var i=0;i<aDiv.length;i++){
	// 		aDiv[i].index=i;
	// 		aDiv[i].onmouseover=function(ev){
	// 			var oEvent=ev||event;
	// 			var oForm=oEvent.fromElement||oEvent.relatedTarget;
	// 			if(this.contains(oForm))return;
	// 			var n=hoverDir(this,oEvent);
	// 			// alert(n);
	// 			var T=this.offsetHeight+'px';
	// 			var L=this.offsetWidth+'px';
	// 			var oHide=aHide[this.index];
	// 			switch(n){
	// 				case 0:
	// 					oHide.style.left=L;
	// 					oHide.style.top=0;
	// 					break;
	// 				case 1:
	// 					oHide.style.left=0;
	// 					oHide.style.top=T
	// 					break;
	// 				case 2:
	// 					oHide.style.left=-L;
	// 					oHide.style.top=0;
	// 					break;
	// 				case 3:
	// 					oHide.style.left=0;
	// 					oHide.style.top=-T;
	// 					break;
	// 			}
	// 			doMove(oHide,{left:0,top:0});
	// 		};
	// 		aDiv[i].onmouseout=function(ev){
	// 			var oEvent=ev||event;
	// 			var oTo=oEvent.toElement||oEvent.relatedTarget;
	// 			if(this.contains(oTo))return;
	// 			var n=hoverDir(this,oEvent);
	// 			var T=this.offsetHeight;
	// 			var L=this.offsetWidth;
	// 			var oHide=aHide[this.index];
	// 			switch(n){
	// 				case 0:
	// 					doMove(oHide,{left:L,top:0});
	// 					break;
	// 				case 1:
	// 					doMove(oHide,{left:0,top:T});
	// 					break;
	// 				case 2:
	// 					doMove(oHide,{left:-L,top:0});
	// 					break;
	// 				case 3:
	// 					doMove(oHide,{left:0,top:-T});
	// 					break;
	// 			}
	// 		};
	// 	}

	// 	// 按钮换一换效果
	// 	var oBtn_change=document.getElementById('JS_btn_change');
	// 	var oBtnL=oBtn_change.offsetLeft;
	// 	var oBtnT=oBtn_change.offsetTop;
	// 	// alert(oBtnL+'--'+oBtnT)
	// 	var bReady=true;
	// 	var timer_c=null;
	// 	oBtn_change.onclick=function(){
	// 		if(bReady==false){
	// 			bReady=true;
	// 		}
	// 		bReady=false;
	// 		var i=0;
	// 		timer_c=setInterval(function(){
	// 			(function(index){
	// 				move(aDiv[i],{width:0, height:0, opacity:0, left:oBtnL, top:oBtnT},{complete:function(){
	// 					if(index==aDiv.length-1){
	// 						// 图片轮换代码，此处没有写

	// 						i=aDiv.length-1;
	// 						timer_c=setInterval(function(){
	// 							move(aDiv[i],{width:aPos[i].width, height:aPos[i].height, left:aPos[i].left, top:aPos[i].top, opacity:1});
	// 							i--;
	// 							if(i==-1){
	// 								clearInterval(timer_c);
	// 								bReady=true;
	// 							}
	// 						},70);
	// 					}
	// 				}})
	// 			})(i);

	// 			i++;
	// 			if(i==aDiv.length){
	// 				clearInterval(timer_c);
	// 			}
	// 		},70);
	// 	};
	// });
	
	//添加onepage插件时，使用个函数
	function t_show()
	{
		function hoverDir(obj,ev){
			var y=obj.offsetTop+obj.offsetHeight/2-ev.clientY;
			var x=obj.offsetLeft+obj.offsetWidth/2-ev.clientX;
			return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;
		}

		var oBox3=document.getElementById('JS_three_girds');
		var aDiv=oBox3.children;
		var aHide=getByClass(oBox3,'disc');

		//布局转换
		var aPos=[];
		for(var i=0;i<aDiv.length;i++){
			aPos[i]={top:aDiv[i].offsetTop,left:aDiv[i].offsetLeft,width:aDiv[i].offsetWidth,height:aDiv[i].offsetHeight};
		}
		for(var i=0;i<aDiv.length;i++){
			aDiv[i].style.left=aPos[i].left+'px';
			aDiv[i].style.top=aPos[i].top+'px';
			aDiv[i].style.width=aPos[i].width+'px';
			aDiv[i].style.height=aPos[i].height+'px';
			aDiv[i].style.position='absolute';
			aDiv[i].style.margin=0;
		}

		// 移入窗墙效果
		for(var i=0;i<aDiv.length;i++){
			aDiv[i].index=i;
			aDiv[i].onmouseover=function(ev){
				var oEvent=ev||event;
				var oFrom=oEvent.fromElement||oEvent.relatedTarget;
				if(this.contains(oFrom))return;
				var n=hoverDir(this,oEvent);
				// alert(n);
				var T=this.offsetHeight+'px';
				var L=this.offsetWidth+'px';
				var oHide=aHide[this.index];
				switch(n){
					case 0:
						oHide.style.left=L;
						oHide.style.top=0;
						break;
					case 1:
						oHide.style.left=0;
						oHide.style.top=T
						break;
					case 2:
						oHide.style.left=-L;
						oHide.style.top=0;
						break;
					case 3:
						oHide.style.left=0;
						oHide.style.top=-T;
						break;
				}
				move(oHide,{left:0,top:0});
			};
			aDiv[i].onmouseout=function(ev){
				var oEvent=ev||event;
				var oTo=oEvent.toElement||oEvent.relatedTarget;
				if(this.contains(oTo))return;
				var n=hoverDir(this,oEvent);
				var T=this.offsetHeight;
				var L=this.offsetWidth;
				var oHide=aHide[this.index];
				switch(n){
					case 0:
						move(oHide,{left:L,top:0});
						break;
					case 1:
						move(oHide,{left:0,top:T});
						break;
					case 2:
						move(oHide,{left:-L,top:0});
						break;
					case 3:
						move(oHide,{left:0,top:-T});
						break;
				}
			};
		}

		// 按钮换一换效果
		var oBtn_change=document.getElementById('JS_btn_change');
		var oBtnL=oBtn_change.offsetLeft;
		var oBtnT=oBtn_change.offsetTop;
		// alert(oBtnL+'--'+oBtnT)
		var bReady=true;
		var timer_c=null;
		oBtn_change.onclick=function(){
			if(bReady==false){
				bReady=true;
			}
			bReady=false;
			var i=0;
			timer_c=setInterval(function(){
				(function(index){
					move(aDiv[i],{width:0, height:0, opacity:0, left:oBtnL, top:oBtnT},{complete:function(){
						if(index==aDiv.length-1){
							// 图片轮换代码，此处没有写
							i=aDiv.length-1;
							timer_c=setInterval(function(){
								
								move(aDiv[i],{width:aPos[i].width, height:aPos[i].height, left:aPos[i].left, top:aPos[i].top, opacity:1});
								i--;
								if(i==-1){
									clearInterval(timer_c);
									bReady=true;
								}
							},70);
						}
					}})
				})(i);

				i++;
				if(i==aDiv.length){
					clearInterval(timer_c);
				}
			},70);
		};
	}
	
	t_show();

	// part-four
	var oBox4=document.getElementById('JS_three_grids');
	var aChild=oBox4.children;
	for(var i=0;i<aChild.length;i++){
		!(function(index){
			aChild[i].onmouseover=function(){
				addClass(this.children[0],'selected');
				move(this.children[1],{opacity:1});
			};
			aChild[i].onmouseout=function(){
				removeClass(this.children[0],'selected');
				move(this.children[1],{opacity:0});
			};
		})(i);
	}

	//footer
	var oFooter=document.getElementById('footer');
	var oBtn_wx=document.getElementById('JS_weixin');
	var oPics=getByClass(oFooter,'pics')[0];
	var oWximg=oBtn_wx.children[1];
	for(var i=0;i<oPics.children.length;i++){
		oPics.children[i].onmouseover=function(){
			this.children[0].style.display='none';
		};
		oPics.children[i].onmouseout=function(){
			this.children[0].style.display='block';
		};
	}
	oBtn_wx.onclick=function(ev){
		var oEvent=ev||event;
		if(oWximg.style.display=='block'){
			oWximg.style.display='none';
		}else{
			oWximg.style.display='block';
		}
		oEvent.cancelBubble=true;
	};
	oFooter.onclick=function(){
		oWximg.style.display='none';
	};

	
});




