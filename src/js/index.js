/**
 * @author H.Yvonne
 * @create 2016.10.13
 * publish box
 */
(function (root, factory) {
    if (typeof exports === 'object') {
        var $;
        try { $ = require('./jquery'); } catch(e) {};
        module.exports = factory($);
    } else if (typeof define === 'function' && define.amd) {
        define(['./jquery'], function ($) {
            return (root.publish = factory($));
        });
    } else {
        root.publish = factory(root.$);
    }
})(this, function ($) {
    var pluginName = 'publish',

        defaults = {
        	list: []
        };

    function Plugin (el, options) {
        this.el = $(el);
        this.options = $.extend(true, {}, defaults, options);
        this._name = pluginName;
        this.emotions = [];
        this.init();
    };

    Plugin.prototype.init = function () {
        this.mouseFn();
        this.getFace();
        this.insertFace();   //插入表情
        this.renderFri();
        this.atFriend();	 //@好友
        // this.upload();       //上传图片
    };

    //mouse event
    Plugin.prototype.mouseFn = function () {
        var _self = this;
        this.el.on('click', '[nt="send-face-btn"]', function () {
            // 插入表情
        	_self.el.find('div.send-face-list').toggle();
        }).on('keyup blur', 'textarea.send-textarea', function () {
        	_self.count($(this));
        }).on('click', '[nt="send-topic-btn"]', function () {
            // 插入话题
            _self.insertTopic();
        });
        $('body').on('click', function (event) {
        	if(_self.el.find('div.send-face-list').is(':visible') == false) return; //表情面板不显示时退出
        	if(!$(event.target).closest('div.send-face-wrap').length) {
        		_self.el.find('div.send-face-list').toggle();
        	}
        });
    };

    //加载表情包
    Plugin.prototype.getFace = function () {
    	var _self = this;
    	var app_id = '1362404091';
    	$.ajax({
		dataType : 'jsonp',
			url : 'https://api.weibo.com/2/emotions.json?source=' + app_id,
			success : function(response) {
				var data = response.data;
				for (var i in data) {
					if(data[i].category == '') {
						_self.emotions.push({
							name : data[i].phrase,
							icon : data[i].icon
						});
					}
				}
				_self.renderFace();
			}
		});
    };
    Plugin.prototype.renderFace = function () {
    	var html = '', _self = this;
    	for(var i in _self.emotions) {
    		html += '<li class="it"><a href="javascript:;" class="sand-face-itbtn"><img src="'+_self.emotions[i].icon+'" width="100%" title="'+_self.emotions[i].name+'" /></a></li>';
    	}
    	this.el.find('ul.send-face-item').html(html);
    };
    //face
    Plugin.prototype.insertFace = function () {
    	var _self = this;
    	this.el.on('click', 'a.sand-face-itbtn', function () {
    		_self.el.find('div.send-face-list').hide();
    		var text = $(this).find('img').attr('title');
    		var pos = _self.getPos();
    		_self.writeTxt(pos,text);
    	});
    };

    // topic
    Plugin.prototype.insertTopic = function () {
        var _self = this,
            obj = _self.el.find('textarea.send-textarea');
        var pos = _self.getPos(),
            text = '#请输入话题#';
        _self.writeTxt(pos,text);
        obj[0].setSelectionRange(pos.start+1,pos.start+6);
        obj.focus();
    };

    Plugin.files = [], Plugin.imgnum = 0;
    //图片上传
    Plugin.prototype.upload = function () {
        var _self = this;
        var upload = new uploader({
            'wrap' : _self.options.upWarp,
            'action' : '/social/uploadImage',
            'fileinputname' : 'comment_image',
            'dom' : $(_self.options.upWarp).find('a[nt="send-image-btn"]'),
            'data' : {
                
            },
            'responseParser' : function(data){
                if(data && data.code == 1) {
                    var html = '',
                        len = files.length | 0;
                    Plugin.imgnum = Plugin.imgnum + data.data.length;
                    for(var i in data.data){
                        Plugin.files.push({
                            'url' : data.data[i]['src'],
                        });
                        html += '<div class="fl send-uppic-item"><div class="send-uppic-inner"><a href="javascript:;" class="send-icons send-uppic-close" data-id="'+(len+parseInt(i))+'"></a><img src="'+data.data[i]['src']+'" width="100%" /></div></div>';
                    }
                    _self.el.find('ul.send-uppic-wrap').prepend(html);
                    //触发上传完成事件
                    return {
                        'files' : files,
                        'extra' : '676767'
                    };
                } else {
                    // hm.alert({
                    //     width : 260,
                    //     text : data.msg
                    // });
                    //触发上传失败事件
                    return {
                    //  'files' : null,
                    //  'files' : [],
                        'extra' : '服务器异常！'
                    };
                }
            }
        });

        //开始上传之前
        upload.on('beforeUpload',function(ID,files){
            this.can_upload = true;
            // var len = $('b[nt="img-count"]').html() | 0;
            // if(len + files.length > 9) {
            //     hm.alert({
            //         text : '最多上传9张图片！'
            //     });
            //     return;
            // }
            for(var i in files){
                if(!files[i]['name'].match(/\.(jpg|jpeg|gif|png|bmp)$/i)){
                    this.can_upload = false;
                    hm.alert({
                        text : '只能上传图片(支持.jpg .jpeg .gif .png .bmp格式)'
                    })
                    break;
                }
            }
        });
        _self.el.find('ul.send-uppic-wrap').on('click','a.send-uppic-close', function () {
            var id = $(this).attr('data-id');
            $(this).parents('div.send-uppic-item').remove();
            Plugin.files.splice(id,1,'');
        });

        upload.on('success',function(ID,files){
            _self.el.find('div.send-uppic-wrap').show();
            // $('b[nt="img-count"]').html(imgnum);
        });
    };


    //渲染好友列表
    Plugin.prototype.renderFri = function () {
        var _self = this, html = '';
        _self.options.list;
        for(var i in _self.options.list) {
            html += '<li class="it"><a href="javascript:;" class="send-at-btn">'+_self.options.list[i].cn_name+'</a></li>';
        }
        _self.el.find('ul.send-at-item').html(html);
    };
    //@好友功能
    Plugin.prototype.atFriend = function () {
        var _self = this;
        this.el.on('click keyup', 'textarea.send-textarea', function (event) {
            var val = $(this).val(),
                pos = _self.getPos(),
                l = val.substr(0,pos.end); 
            if(/\S*[@]+\S*$/.test(l)) {
                _self.setPos($(this));
                _self.selects($(this));
            } else {
                if(!_self.el.find('div.send-at-wrap').is(':hidden')) {
                    _self.el.find('div.send-at-wrap').hide();
                }
            }
            if(!_self.el.find('div.send-at-wrap').is(':hidden')) {
                if(event.keyCode == 38 || event.keyCode == 40) return;
                _self.search($(this));
            }
        });
    };
    //设置人物列表位置
    Plugin.prototype.setPos = function (obj) {
    	var val = obj.val(), 
    		pos = this.getPos(),
    		l = val.slice(0,pos.start),
    		mask = this.el.find('div.send-show-wrap');
    	mask.text(l);    //写入隐藏图层获取光标位置
    	this.el.find('div.send-at-wrap').css({
    		left: mask.width()-15,
    		top: mask.height()+15
    	}).show();
    };
    //模糊搜索
    Plugin.prototype.search = function (obj) {
        Plugin.ind = 0;
        var val = obj.val(),
            pos = this.getPos(),
            at = val.slice(0,pos.start).lastIndexOf('@');//获取离光标最近的@位置
            l = val.slice(at,pos.start),
            filterData = [];
        if(at <= -1) {
            this.el.find('div.send-at-wrap').hide();
        }
        var filter = l.split('@')[1];
        if(filter.indexOf('\'')>0){
            filter=filter.replace(/\'/,'');
        }
        var list = this.options.list;
        if(!filter) {
            this.render(list);
            return;
        };
        for(var i in list) {
            if(list[i].cn_name.indexOf(filter) > -1 || list[i].en_name.indexOf(filter) > -1 || list[i].shou.indexOf(filter) > -1 || list[i].quanpin.indexOf(filter) > -1){
                filterData.push(list[i]);
            }
        }
        if(filterData.length <= 0) {
            this.el.find('div.send-at-wrap').hide();
        } else {
            this.render(filterData);
        }
    };
    Plugin.prototype.render = function (data) {
    	var html = '';
    	for(var j in data) {
    		html += '<li class="it"><a href="javascript:;" class="send-at-btn">'+data[j].cn_name+'</a></li>';
    	}
    	this.el.find('ul.send-at-item').html(html);
    	this.el.find('a.send-at-btn').eq(0).addClass('send-at-active');
    };

    Plugin.ind = 0;
    //下拉列表事件
    Plugin.prototype.selects = function (obj) {
    	var _self = this, maxLen = Math.floor(this.el.find('div.send-at-list').height()/_self.el.find('a.send-at-btn').eq(0).height());
    	if(_self.el.find('div.send-at-wrap').is(':hidden') == true) return;
    	this.el.off('keydown').on('keydown', 'textarea.send-textarea', function (event) {
    		var pos = _self.getPos();
    		switch(event.keyCode) {
    			case 13: 
    				var text = _self.el.find('a.send-at-active').text();
    				_self.writeTxt(pos,text+' ',obj);
                    _self.el.find('div.send-at-list').scrollTop(0);
    				_self.el.find('div.send-at-wrap').hide();
    				return false;
    				break;
    			case 38:
    				if(Plugin.ind<=0) {
    					Plugin.ind = _self.options.list.length-1;
    				} else {
    					Plugin.ind -= 1;
    				}
    				_self.el.find('a.send-at-btn').removeClass('send-at-active').eq(Plugin.ind).addClass('send-at-active');
                    if(Plugin.ind<maxLen) {
                        _self.el.find('div.send-at-list').scrollTop((Plugin.ind+2-maxLen)*25)
                    } else if(Plugin.ind == _self.options.list.length-1) {
                        _self.el.find('div.send-at-list').scrollTop(_self.el.find('div.send-at-list').height())
                    }
    				return false;
    				break;
    			case 40:
    				if(Plugin.ind >= _self.options.list.length-1) {
    					Plugin.ind = 0;
    				} else {
    					Plugin.ind += 1;
    				}
    				_self.el.find('a.send-at-btn').removeClass('send-at-active').eq(Plugin.ind).addClass('send-at-active');
                    if(Plugin.ind>maxLen) {
                        _self.el.find('div.send-at-list').scrollTop((Plugin.ind+2-maxLen)*25)
                    } else if(Plugin.ind == 0) {
                        _self.el.find('div.send-at-list').scrollTop(0)
                    }
    				return false;
    				break;
    		}
    	});
    	this.el.off('click.confirm').on('click.confirm', 'a.send-at-btn', function () {
    		var text = $(this).text();
    		var pos = _self.getPos();
    		_self.writeTxt(pos,text+' ',obj);
            _self.el.find('div.send-at-list').scrollTop(0);
    		_self.el.find('div.send-at-wrap').hide();
    	});
    };

    //写入数据
    Plugin.prototype.writeTxt = function (pos,text,pobj) {
    	var obj = this.el.find('textarea.send-textarea');
    		val = obj.val(),
    		// l = val.slice(0,pos.start),
    		r = val.slice(pos.end);
        if(pobj) {
            var ind = pobj.val().slice(0,pos.start).lastIndexOf('@')+1,
                l = val.slice(0,ind);
        } else {
            var l = val.slice(0,pos.start);
        }
    	var txt = l+text+r;
    	// obj.val(txt).focus();
        obj.val(txt);
        obj[0].setSelectionRange(pos.start+text.length,pos.start+text.length);
    	this.count(obj);
    };
    //字数统计
    Plugin.prototype.count = function (obj) {
    	var _self = this;
    	this.verLetterCont.call(obj, function(a, b) {
            obj.siblings('span.send-count').text(a + '/' + b);
        });
    };
    Plugin.prototype.verLetterCont = function(callback) {
		var maxLen = this.attr('maxlength'), str = this.val().slice(0, maxLen);
		var strlen = str.length;
		if ( typeof callback === 'function')
			callback(strlen, maxLen);
		if (this.val().length < maxLen)
			return false;
		this.val(str);
	};

    //获取光标位置
    Plugin.prototype.getPos = function () {
    	var txt = this.el.find('textarea.send-textarea');
		var start = txt[0].selectionStart,
			end = txt[0].selectionEnd,
			len = txt.val().length;
		return {
			start: start,
			end: end,
			len: len
		};
    };
    

    return $.fn[pluginName] = function (options) {
        return this.each(function () {
            if(!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }
});