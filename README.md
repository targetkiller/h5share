#H5SHARE

##介绍

不同社交平台的自定义分享接口不统一，且存在分享接口拉取失败的可能，会导致分享出去的内容(标题、描述、缩略图）不合理。该组件集合了微信、空间、手Q、音乐、K歌等社交平台自定义分享接口，并作了自定义失败默认拉取指定信息的处理，大大增强社交分享的成功率。

附一个分享网站：[社交平台分享检测工具](http://tonytony.club/tool/share-check/index.html)

##接口
目前有1个构造函数，3个方法。

构造函数 var hs = h5share(config);
更新分享信息 hs.update();
弹出分享框 hs.showShareMenu();
获取终端信息 hs.getTerm();

##用法
1.引用插件：
```html
<script type='text/javascript' src='h5share.js'></script>
```

2.构造方法传参：
```javascript
//返回hs对象，可用于链式调用其他方法。
var config = {
  //基础信息
  title':title,//必填,用于分享的标题
  'desc':desc,//必填,用于分享的描述
  'url':url,//必填,用于分享的链接
  'img':img,//必填,用于分享的缩略图,建议250x250

  //微信信息,参考微信JSSDK配置
  'appId':appId,//必填,公众号的唯一标识
  'timestamp':timestamp,//必填,生成签名的时间戳
  'nonceStr':nonceStr,//必填,生成签名的随机串
  'signature':signature,//必填,签名

  //调试
  'debug':false//选填,若为true会弹出状态信息,默认false
}

//直接配置信息
h5share(config);

//或者拿到对象,支持链式调用其他方法
var hs = h5share(config);
```

3.其他方法
hs.update(config);  //更新配置信息
```javascript
hs.update({
  'title':title,//选填，修改后的分享的标题
  'desc':desc,//选填，修改后的分享的描述
  'url':url,//选填，修改后的分享的链接
  'img':img,//选填，修改后的分享的缩略图
});
```

hs.showShareMenu(callback);  //弹出分享窗口（只有空间、手Q支持）
```javascript
//回调函数,可选						
hs.showShareMenu(function(state){
  if(state==false){
    //弹出"点击右上角图标分享"提示
  }
});
```

hs.getTerm();  //获取当前平台终端
```javascript
//获取匹配的终端类型
var result = hs.getTerm();

//结果返回
'wechat':微信
'qq':手机QQ
'qzone':QQ空间
'music':QQ音乐
'kge':全民K歌
'other':其他平台,若other表示不能自定义分享
```

4.CMD规范
引入了CMD规范支持，可直接用SeaJs或CommonJS等实现模块化。

```html
var h5share = require('h5share');
```

##体验
demo地址 http://www.isux.us/h5/h5share/index.html


![](http://qzonestyle.gtimg.cn/aoi/sola/20151221174638_Qf2RQZPVyA.png)

##License
MIT