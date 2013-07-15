// ==UserScript==
// @name           Weibo Larger Pics
// @namespace      http://xiaoxia.de/
// @description    Easily view larger pics on Weibo.com
// @version        0.03
// @author         xiaoxia
// @include        http://t.sina.com.cn/*
// @include        http://weibo.com/*
// @include        http://www.weibo.com/*
// @exclude        http://hot.weibo.com/*
// @exclude        http://s.weibo.com/*
// @exclude        http://e.weibo.com/*
// @exclude        http://weibo.com/app/*
// @exclude        http://weibo.com/app
// @updateinfo     ...
// ==/UserScript==

//version for auto update
var tsinam_version = "0.03";
var t_rdate = "2013-07-15";
var isFirefox = navigator.userAgent.toLowerCase().match('firefox');

if(document.getElementById('pl_content_homeFeed') != null){
    var nodeListen = document.getElementById('pl_content_homeFeed');
}else if(document.getElementById('pl_content_hisFeed') != null){
    var nodeListen = document.getElementById('pl_content_hisFeed');
}else{
    return;
}

nodeListen.addEventListener('DOMSubtreeModified',function(e){

    //插入 i 标签
    function insertI(node,symbol){
        var iElement = document.createElement("i");
        iElement.className = 'W_vline';
        iElement.innerHTML = symbol;
        node.appendChild(iElement);
    }

    try{
        var that = e.target || event.target;
        //判断 event 节点是否要求
        if(typeof(that.children) != 'undefined' && that.children.length > 0){

            //火狐修正
            if(isFirefox){
                var browserTest  = ((that.className.match('WB_media_expand') && that.className.match('SW_fun2') && that.style.display != "none") || ( that.className == 'expand' && (that.parentNode.style.display != "none" && that.style.display != "none")) || (that.getAttribute('node-type') == 'imagesBox' && that.style.display != "none"));
            }else{
                var browserTest = (that.className.match('WB_media_expand') && that.className.match('SW_fun2')) || that.className == 'expand' || (that.getAttribute('node-type') == 'imagesBox');
            }
            //判断 event dom 是否为需要操作的 dom，that.getAttribute('node-type') == 'imagesBox' 为非转发多图的状态。
            if(browserTest){
                //console.log('1');

                //判断是否为多图模式
                var notMulti = true;
                if(typeof(that.children[0].getAttribute('node-type')) == 'string'){
                    that = that.children[0];
                    notMulti = false;
                }
                var attr = that.children[1].getAttribute('action-type');
                var cls = that.children[1].className;
                attr = attr != null ? attr : '';
                cls = cls != null ? cls : '';

                //继续判断是否为需要操作的 dom
                if(attr.match('img') || cls.match('pic_list_view')){
                    //console.log('2');

                    insertI(that.children[0],'<');
                    var aElement = document.createElement("a");

                    //获取图片格式
                    if(notMulti && that.getAttribute('node-type') != 'imagesBox'){
                        format = that.children[1].children[0].src.replace(/.*(\....)$/,'$1');
                    }else{
                        format = that.children[1].children[0].children[0].children[0].children[0].src.replace(/.*(\....)$/,'$1');
                        var t;
                        that.children[0].addEventListener('mouseover',function(){
                            format = that.children[1].children[0].children[0].children[0].children[0].src.replace(/.*(\....)$/,'$1');
                            para = that.children[0].children[2].getAttribute('action-data').replace(/[upm]id=/g,'').split('&');
                            pid = para[0];
                            mid = para[1];
                            uid = para[2];
                            that.children[0].children[8].href = 'http://photo.weibo.com/' + uid + '/wbphotos/large/mid/' + mid + '/pid/' + pid;
                            that.children[0].children[10].href = 'http://ww2.sinaimg.cn/large/' + pid + format;
                        })
                    }

                    //大图地址
                    para = that.children[0].children[2].getAttribute('action-data').replace(/[upm]id=/g,'').split('&');
                    pid = para[0];
                    mid = para[1];
                    uid = para[2];
                    aElement.href = 'http://photo.weibo.com/' + uid + '/wbphotos/large/mid/' + mid + '/pid/' + pid;
                    aElement.target = '_blank';
                    aElement.innerHTML = '图';
                    aElement.title = '进入相册大图页面';
                    that.children[0].appendChild(aElement);

                    //相册详情
                    if(notMulti){
                        insertI(that.children[0],'|');
                        var aElement = document.createElement("a");
                        aElement.href = 'http://photo.weibo.com/' + uid + '/talbum/detail/photo_id/' + mid;
                        aElement.target = '_blank';
                        aElement.title = '进入相册详情页面';
                        aElement.innerHTML = '详';
                        that.children[0].appendChild(aElement);
                    }

                    //原图地址
                    insertI(that.children[0],'|');
                    var aElement = document.createElement("a");
                    aElement.href = 'http://ww2.sinaimg.cn/large/' + pid + format;
                    aElement.target = '_blank';
                    aElement.title = '大图原始地址，在此点击右键可以另存或复制地址';
                    aElement.innerHTML = '源';
                    that.children[0].appendChild(aElement);
                    insertI(that.children[0],'>');
                }
            }
        }
        delete that;
    }catch(err){}
})