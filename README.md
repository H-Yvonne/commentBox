评论发布框
=========
简介
-----------
仿微博类评论发布框，包括话题、表情、@功能（图片上传还未开发完成）

Example
-----------
定义发布框样式
```html
<div nt="send-main">
	<div class="send-wrap">
		<div class="send-area-wrap">
			<textarea class="send-textarea" maxlength="140"></textarea>
			<span class="send-count">0/140</span>
			<div class="send-show-wrap">|</div>
		</div>
		<div class="send-btn-wrap clearfix">
			<div class="fl send-func-wrap clearfix">
				<div class="fl send-topic-wrap">
					<a href="javascript:;" class="send-topic-btn clearfix" nt="send-topic-btn">
						<i class="fl send-icons"></i>
						<u class="fl">话题</u>
					</a>
				</div>
				<div class="fl send-face-wrap">
					<a href="javascript:;" class="send-face-btn clearfix" nt="send-face-btn">
						<i class="fl send-icons"></i>
						<u class="fl">表情</u>
					</a>
					<div class="send-face-list">
						<i class="send-face-arrow"></i>
						<i class="send-face-arrow1"></i>
						<ul class="send-face-item clearfix"></ul>
					</div>
				</div>
				<!-- <div class="fl send-pic-wrap" nt="up-wrap">
					<a href="javascript:;" class="send-pic-btn clearfix" nt="send-image-btn">
						<i class="fl send-icons"></i>
						<u class="fl">图片</u>
					</a>
				</div> -->
			</div>
			<a href="javascript:;" class="fr send-submit-btn">发布</a>
		</div>
		<div class="send-uppic-wrap clearfix"></div>
		<div class="send-at-wrap">
			<div class="send-at-title">选择最近@的人或者直接输入</div>
			<div class="send-at-list">
				<ul class="send-at-item clearfix"></ul>
			</div>
		</div>
	</div>
</div>
```
引入样式文件，js文件
```
<script type="text/javascript" src="/src/js/jquery.js"></script>
<script type="text/javascript" src="/src/js/index.js"></script>
```
方法调用
```
<script type="text/javascript">
    var arrays = [
      {'id': 0,'cn_name':'李妍','quanpin':'liyan','en_name':'LY','shou':''},
      {'id': 1,'cn_name':'曹霞','quanpin':'caoxia','en_name':'CX','shou':''},
      {'id': 2,'cn_name':'刘莹利','quanpin':'liuyingli','en_name':'LYL','shou':''},
      {'id': 3,'cn_name':'张剑芳','quanpin':'zhangjianfang','en_name':'ZJF','shou':''},
      {'id': 4,'cn_name':'梁晶晶','quanpin':'liangjingjing','en_name':'LJJ','shou':''},
      {'id': 0,'cn_name':'李妍','quanpin':'liyan','en_name':'LY','shou':''},
      {'id': 1,'cn_name':'曹霞','quanpin':'caoxia','en_name':'CX','shou':''},
      {'id': 2,'cn_name':'刘莹利','quanpin':'liuyingli','en_name':'LYL','shou':''},
      {'id': 3,'cn_name':'张剑芳','quanpin':'zhangjianfang','en_name':'ZJF','shou':''},
      {'id': 4,'cn_name':'梁晶晶','quanpin':'liangjingjing','en_name':'LJJ','shou':''}
    ];
    var options = {
      list: arrays
    };
    publish.call($('div[nt="send-main"]'),options);
</script>
```

参数说明
----------
<pre><code>
$('div[nt="send-main"]'): 发布框dom
list: AT好友功能的好友列表数据
</code></pre>

注
----------
文本框中输入@字符自动检测出现好友列表，输入空格列表隐藏可继续操作
