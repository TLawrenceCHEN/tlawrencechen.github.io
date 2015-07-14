//获取可见区域长宽
var clientW = $(window).width();
var clientH = $(window).height();
//初始化主体框架
var $waterfall = $('<div/>');
$waterfall.attr('class', 'waterfall');
$waterfall.css('position', 'absolute');
$waterfall.css('left', clientW * 0.11 + 'px');
$waterfall.css('right', clientW * 0.11 + 'px');
$waterfall.css('background-color', 'transparent');
$waterfall.css('height', '1500px');
$('body').append($waterfall);
//初始化照片列
var $photo_column = [];
for(var i = 0; i < 4; i++){
	$photo_column[i] = $('<div/>');
	$photo_column[i].attr('class', 'photo_column');
	$photo_column[i].css('float', 'left');
	$photo_column[i].css('width', '200px');
	$photo_column[i].css('margin-left', '50px');
	$photo_column[i].css('border-radius', '20px');
	$('.waterfall').append($photo_column[i]);
}
//初始化照片放置区域
function setPhotos(max, json){
	for(var i = 0; i < max; i++){
		var $photo_box = [];
		$photo_box[i] = $('<div/>');
		$photo_box[i].attr('id', 'photo' + i);
		$photo_box[i].attr('class', 'photo_box');
		$photo_box[i].css('overflow', 'hidden');
		$photo_box[i].css('margin', '5px');
		$photo_box[i].css('background-color', 'white');
		$photo_box[i].css('border', 'silver 5px solid');
		$photo_box[i].css('border-radius', '20px');
		$photo_column[i % 4].append($photo_box[i]);
		$photo_box[i].append("<img src = '" + json.image[i].path + "'>");
	}
}
$.getJSON("json/imageName0To29.json", function(json){
	setPhotos(30, json);
});
$('img').css('width', $('.photo_box').css('width'));
$('img').attr('alt', '图片加载失败');
$('.lefttitlebg').css('width', $('.photo_box').css('width'));
$('.righttitlebg').attr('alt', '图片加载失败');
//获取整个文档长宽
var documentW = $(document).width();
var documentH = $(document).height();
//设置背景
var $bg = [];
for(var i = 0; i < 6; i++){
	var str = "url('bg/bg" + i + ".jpg')";
	$bg[i] = $('<div/>');
	$bg[i].css('background-image', str);
	$bg[i].css('left', '0px');
	$bg[i].css('top', '0px');
	$bg[i].css('width', '100%');
	$bg[i].css('height', documentH + 'px');
	$bg[i].css('display', 'block');
	$bg[i].css('position', 'absolute');
	$bg[i].css('z-index', '-2');
	if(i !== 0){
		$bg[i].css('display', 'none');
	}
	$('body').append($bg[i]);
}
var scrollToBottomTimes = 1;
$(window).scroll(function(){
	for(var i = 0; i < 6; i++){
		if($(document).scrollTop() > (i * (documentH - clientH) / 6) && 
			$(document).scrollTop() <= ((i + 1) * (documentH - clientH) / 6) && 
			$bg[i].css('display') === 'none'){
			$bg[i].fadeIn(100);
			for(var j = 0; j < 6; j++){
				if(j != i){
					$bg[j].fadeOut(100);
				}
			}
		}
	}
	if($(document).scrollTop() === (documentH - clientH) && scrollToBottomTimes == 1){
		$.getJSON("json/imageName30To59.json", function(json){
			setPhotos(30, json);
		});
	}
});