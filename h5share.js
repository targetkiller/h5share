/**
 * @license h5share.js v1.0.0 30/06/2015
 *
 * Copyright (c) 2015, TQ TAN (tqtan.com/i@tqtan.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

;(function(global,doc) {
	// 加载js
	function loadscript(url,cb){
		var ref = window.document.getElementsByTagName("script")[0];
		var script = window.document.createElement("script");
		script.src = url;
		script.type = 'text/javascript';
		script.async = false;
		ref.parentNode.insertBefore( script, ref );
		if (cb && typeof(cb) === "function") {
			script.onload = cb;
		}
		return script;
	}
	
	// 页面中插入meta标签
	function insertMeta(item,content) {
	    var script = doc.createElement("meta");
	    script.setAttribute('itemprop',item);
	    script.setAttribute('name',item);
	    script.content = content;
	    doc.head.appendChild(script);
	}

	// 插入空图片
	function insertShareImg(img_url){
		var div = doc.createElement('div');
		div.style.position = 'absolute';
		div.style.opacity = '0';
		div.style.zIndex = '-1';
		var img = new Image();
		img.src = img_url;
		div.appendChild(img);
		doc.body.insertBefore(div,doc.body.children[0]);
	}

	function getPlatform(){
		var platform;
		if(/qqmusic/i.test(navigator.userAgent)){
		    platform = 'music';
		}else if(/MicroMessenger/.test(navigator.userAgent)){
		    platform = 'wechat';
		}else if(/QQ\//.test(navigator.userAgent)){
		    platform = 'qq';
		} else if (/qmkege/ig.test(navigator.userAgent)) {
		    platform = 'kge';
		} else if (/qzone/ig.test(navigator.userAgent)) {
		    platform = 'qzone';
		}
		else{
			platform = 'other';
			that.showTips('抱歉,当前页面不能自定义分享!');
		}
		return platform;
	}

	var h5share = function(){};

	// 弹出提示
	h5share.prototype.showTips = function(_txt){
		var txt = _txt||'';
		if(this._data.debug==false){return;}
		var tips = document.getElementById('h5share_tips');
		var body = window.document.getElementsByTagName("body")[0];
		if(tips===null){
			tips = window.document.createElement("div");
			tips.setAttribute('id','h5share_tips');
			tips.className = "h5share_tips";
			tips.style.cssText = "max-width:80%;text-align:center;display: block;padding: 5px 8px;background-color: rgba(0,0,0,0.8);position: absolute;-webkit-transform: translate3d(-50%,-50%,0);transform: translate3d(-50%,-50%,0);top: 50%;left: 50%;border-radius: 3px;font-size: 14px;color: #fff;z-index:9999;";
			body.appendChild(tips);
		}
		tips.innerText = txt;
		tips.style.display='block';
		setTimeout(function(){
			tips.style.display='none';
		},2000);
	}

	h5share.prototype.setData = function(obj){
		this._data = {
			'title':obj.title||doc.title,
			'desc':obj.desc||'',
			'img':obj.img||'',
			'url':obj.url||'',
			'appId':obj.appId||'',
			'timestamp':obj.timestamp||'',
			'nonceStr':obj.nonceStr||'',
			'signature':obj.signature||'',
			'debug':obj.debug||false
		};
	}

	h5share.prototype.prepare = function(){
		insertMeta('name',this._data.title);
		insertMeta('description',this._data.desc);
		insertMeta('image',this._data.img);
		insertShareImg(this._data.img);
	}

	h5share.prototype.shareWX = function(){
		var that = this;
		// 旧wechat接口
		document.addEventListener('WeixinJSBridgeReady', function () {
	        WeixinJSBridge.on("menu:share:timeline", function(e) {                   
	            var data = {
	                img_url: that._data.img,
	                link: that._data.url,
	                desc: that._data.desc,
	                title: that._data.title
	            };                    
	            WeixinJSBridge.invoke("shareTimeline",data,function(res){WeixinJSBridge.log(res.err_msg)});                
	        });            
	        
	        WeixinJSBridge.on('menu:share:appmessage', function(argv){           
	            var data = {
	                img_url: that._data.img,
	                link: that._data.url,
	                desc: that._data.desc,
	                title: that._data.title
	            };          
	            WeixinJSBridge.invoke("sendAppMessage", data, function (res) {
	                WeixinJSBridge.log(res.err_msg);
	            });                
	        });
	    });

		// 新wechat接口
		if(wx){
			wx.config({
	            debug : false, //调试
	            appId : that._data.appId,
	            timestamp : that._data.timestamp,
	            nonceStr : that._data.nonceStr,
	            signature : that._data.signature,
	            jsApiList : [
	                'onMenuShareTimeline',
	                'onMenuShareAppMessage',
	                'onMenuShareQQ',
	                'onMenuShareQZone',
	                'onMenuShareWeibo'
	            ]
	        });
	        wx.ready(function(){
	            var config = {
	                title: that._data.title, // 分享标题
	                desc: that._data.desc, // 分享描述
	                link: that._data.url, // 分享链接
	                imgUrl: that._data.img, // 分享图标
	                success: function(){
	                	console.log('wx config success');
	                },
	                cancel: function(){
	                	console.log('wx config cancel');
	                }
	            };
	            wx.onMenuShareTimeline(config);
	            wx.onMenuShareAppMessage(config);
	            wx.onMenuShareQQ(config);
	            wx.onMenuShareQZone(config);
	            wx.onMenuShareWeibo(config);
				that.showTips('微信分享接口配置成功');
	        });
		}
		else{
			that.showTips('微信分享接口调用失败');
		}
	}

	h5share.prototype.shareQQ = function(){
		var that = this;
        if(mqq){
            mqq.ui.setOnShareHandler(function(type) {     
                mqq.ui.shareMessage({
                    title: that._data.title,
                    desc: that._data.desc,
                    share_type : type,
                    share_url: that._data.url,
                    image_url: that._data.img,
                }, function(ret){
					that.showTips('QQ分享接口配置成功');
                    console.log(ret);
                });
            }); 
        }
        else{
			that.showTips('QQ分享接口调用失败');
		}
	}

	h5share.prototype.shareQZONE = function(){
		var that = this;
		if(QZAppExternal||mqq){
			var imageArr = [],
                titleArr = [],
                summaryArr = [],
                shareURLArr = [];
            for (var i = 0; i < 5; i++) {
                imageArr.push(that._data.img);
                titleArr.push(that._data.title);
                summaryArr.push(that._data.desc);
                shareURLArr.push(that._data.url);
            }

            // 获取版本转化为两位数字
            var appVer = navigator.userAgent.match(/QQJSSDK\/\S+/);
            if(appVer!==null){
				appVer = parseInt(appVer[0].split('QQJSSDK/')[1].split('.').join('').slice(0,2));
				if(appVer<55){
		            // 5.5以下版本用旧接口
					QZAppExternal.setShare(function (data) {
		            }, {
		                'type': 'share',
		                'image': imageArr,
		                'title': titleArr,
		                'summary': summaryArr,
		                'shareURL': shareURLArr
		            });
					that.showTips('空间分享接口设置成功！');
				}
				else{
		            // 5.5+以后新接口
		            mqq.invoke('share','setShare',
					{
				       	'type' : "share",
				       	'image':imageArr,
						'title':titleArr,
						'summary':summaryArr,
						'shareURL':shareURLArr
			        },function(){
						that.showTips('空间分享接口设置成功！');
			        });
				}
			}
		}
		else{
			that.showTips('空间分享接口调用失败');
		}
	}

	// 空间直接分享
	h5share.prototype.showShareMenu = function(callback){
		var that = this;
		if(getPlatform()!=='qzone'&&getPlatform()!=='qq'){
			that.showTips('仅空间支持弹出分享');
			callback&&callback(false);
			return;
		}
		if(getPlatform()=='qzone'){
			// 获取版本转化为两位数字
			var appVer = navigator.userAgent.match(/QQJSSDK\/\S+/);
            if(appVer!==null){
				appVer = parseInt(appVer[0].split('QQJSSDK/')[1].split('.').join('').slice(0,2));
				if(mqq||QZAppExternal){
					if(appVer<55){
			            // 5.5以下版本用旧接口
						QZAppExternal.setShare(function (data) {
			            }, {
			                'type': 'share',
			                'image': imageArr,
			                'title': titleArr,
			                'summary': summaryArr,
			                'shareURL': shareURLArr
			            });
						that.showTips('空间分享接口设置成功！');
					}
					else{
						// 弹窗分享
			            mqq.invoke('ui','showShareMenu',null,function(){
							that.showTips('分享窗口弹出');
				        });
					}
				}
				else{
					that.showTips('该平台暂不支持分享窗口弹出');
				}
			}
		}
		else{
			if(mqq){
	            // 弹窗分享
	            mqq.invoke('ui','showShareMenu',null,function(){
					that.showTips('分享窗口弹出');
		        });
			}
			else{
				that.showTips('该平台暂不支持分享窗口弹出');
			}
		}
	}

	h5share.prototype.shareQMUSIC = function(){
		var that = this;
		function callback(){
            var shareData = {
                img_url: that._data.img,
                img_width: "173",
                img_height: "173",
                link: that._data.url,
                desc: that._data.desc,
                title: that._data.title
            }

            //设置分享
            //android4.2之前的版本开始把title和desc弄反了
            var appVer = navigator.userAgent.match(/ANDROIDQQMUSIC\/(\d+)/); 
            appVer=(appVer && appVer.length>1) ? appVer[1] : 4020000;
            if (appVer<4020000) {
                var desc=shareData.desc;
                shareData.desc = shareData.title;
                shareData.title = desc;
            }
            common.bridge.callHandler('share', shareData, function(){
				that.showTips('QQ音乐分享接口设置成功！');
            });
        }
        if(window.WebViewJavascriptBridge){
            common.bridge = window.WebViewJavascriptBridge;
            common.bridge.init();
            callback();
        }else{
            document.addEventListener('WebViewJavascriptBridgeReady', function(e) {
                var e = e || window.event;
                common.bridge = e.bridge;
                common.bridge.init();
                callback();
            });
        }
	}

	h5share.prototype.shareKGE = function(){
		location.href = 'qmkege://kege.com?action=setshare&title=' + encodeURIComponent(this._data.title) +
            '&content=' + encodeURIComponent(this._data.desc) + '&link=' + encodeURIComponent(this._data.url) +
            '&cover=' + encodeURIComponent(this._data.img)
		that.showTips('全民K歌分享接口设置成功！');
	}

	// **关键方法，执行分享
	h5share.prototype.execute = function(){
		switch(getPlatform()){
			case 'wechat':
				this.shareWX();
				break;
			case 'qq':
				this.shareQQ();
				break;
			case 'qzone':
				this.shareQZONE();
				break;
			case 'music':
				this.shareQMUSIC();
				break;
			case 'kge':
				this.shareKGE();
				break;
			default:
				break;
		}
	}

	h5share.prototype.init = function(callback){
		var that = this;
		switch(getPlatform()){
			case 'wechat':
				loadscript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',function(){
					that.shareWX();
				});
				break;
			case 'qq':
				loadscript('http://pub.idqqimg.com/qqmobile/qqapi.js?_bid=152',function(){
					that.shareQQ();
				});
				break;
			case 'qzone':
				loadscript('http://qzs.qq.com/qzone/phone/m/v4/widget/mobile/jsbridge.js',function(){
					that.shareQZONE();
				});
				break;
			case 'music':
				that.shareQMUSIC();
				break;
			case 'kge':
				that.shareKGE();
				break;
			default:
				break;
		}
	}

	// 获取终端
	h5share.prototype.getTerm = function(){
		return getPlatform();
	}

	// 更新
	h5share.prototype.update = function(data,callback){
		var that = this;
		that.setData(data);
		var config = {
            title: that._data.title, // 分享标题
            desc: that._data.desc, // 分享描述
            link: that._data.url, // 分享链接
            imgUrl: that._data.img, // 分享图标
            success: function(){
            	console.log('wx config success');
            },
            cancel: function(){
            	console.log('wx config cancel');
            }
        };

		switch(getPlatform()){
			case 'wechat':
				if(wx){
		            wx.onMenuShareTimeline(config);
		            wx.onMenuShareAppMessage(config);
		            wx.onMenuShareQQ(config);
		            wx.onMenuShareQZone(config);
		            wx.onMenuShareWeibo(config);
				}
				that.showTips('微信分享信息更新成功');
				break;
			case 'qq':
				that.showTips('QQ分享信息更新成功');
				break;
			case 'qzone':
				this.shareQZONE();
				break;
			case 'music':
				this.shareQMUSIC();
				break;
			case 'kge':
				this.shareKGE();
				break;
			default:
				break;
		}

		callback&&callback();
	}

	// 添加监听
	h5share.prototype.on = function(data, callback) {
		if(typeof data === 'function') {
		  callback = data;
		  data = null;
		}

		// 设置参数
		this.setData(data);

		// 页面准备，包括meta头和隐藏缩略图
		this.prepare();

		// 加载对应终端js并初始化
		this.init();

		// 回调
		callback&&callback();
		return this;
	};

	// 对外只分享一个接口，不过会返回本身，可以有备用
	var hs = new h5share();

	// 创建唯一实例
	var entry = function() {
		return hs.on.apply(hs, arguments);
	};

	//暴露出去
    global.h5share = global.h5share || entry;

})(window,document);