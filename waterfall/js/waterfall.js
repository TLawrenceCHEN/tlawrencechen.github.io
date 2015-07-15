var photoNum = 0;
var curPhotoIndex = 0;
var curscrollTopPos = 0;
var columnHeight = [0, 0, 0, 0];
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
	$photo_column[i].css('min-width', '150px');
	$photo_column[i].css('margin-left', '50px');
	$photo_column[i].css('border-radius', '20px');
	$('.waterfall').append($photo_column[i]);
}
//初始化照片放置区域
var $photo_box = [];
var $photo = [];
for(var i = 0; i < 120; i++){
	$photo_box[i] = $('<div/>');
	$photo_box[i].attr('class', 'photo_box');
	$photo_box[i].attr('id', 'box' + i);
	$photo_box[i].css('overflow', 'hidden');
	$photo_box[i].css('margin', '8px');
	$photo_box[i].css('background-color', 'white');
	$photo_box[i].css('border', 'white 10px solid');
	$photo_box[i].css('display', 'none');
	$photo[i] = $('<img/>');
	$photo[i].attr('id', i);
	$photo[i].attr('class', 'photo');
	$photo_box[i].append($photo[i]);
}
//获取照片
function setPhotos(max, json){
	//正在加载页面
	$('.spinner').css('display', 'inline-block');
	$('.spinner').css('left', clientW / 2  - 30 + 'px');
	$('.spinner').css('top', clientH / 2 - 30 + 'px');
	$('.spinner').css('position', 'fixed');
	for(var i = photoNum; i < photoNum + max; i++){
		$photo_box[i].css('display', 'block');
		$photo[i].attr('src', json.image.path[i - photoNum]);
		$photo[i].css('opacity', '0');
		$photo[i].css('width', $photo_column[0].width());
		$photo[i].css('position', 'fixed');
		$photo[i].css('left', '0px');
		$photo[i].css('top', '0px');
		$('body').append($photo_box[i]);
		$photo[i].load(function(){
			var tar = 0;
			var imgHeight = $(this).height();
			var minHeight = columnHeight[0] + imgHeight;
			for(var i = 1; i < 4; i++){
				if(minHeight > columnHeight[i] + imgHeight){
					minHeight = columnHeight[i] + imgHeight;
					tar = i;
				}
			}
			$('body').remove('#' + $(this).parent().attr('id'));
			$photo_column[tar].append($(this).parent());
			$(this).css('opacity', '1');
			$(this).css('width', '100%');
			$(this).css('position', '');
			$(this).css('left', '');
			$(this).css('top', '');
			columnHeight[tar] += imgHeight;
			debugger;
			if($(this).attr('id') == photoNum - 1){
				$('.spinner').css('display', 'none');
			}
		});
	}
	photoNum += max;
}
$.getJSON("json/imageName0To29.json", function(json){
	setPhotos(30, json);
});
//获取整个文档长宽
var documentW = $(document).width();
var documentH = $(document).height();
//初始化弹层组件
//弹层主界面
var $photo_pop_view = $('<div/>');
$photo_pop_view.css('background-color', 'black');
$photo_pop_view.css('left', clientW * 0.11 + 'px');
$photo_pop_view.css('right', clientW * 0.3 + 'px');
$photo_pop_view.css('top', clientH * 0.05 + 'px');
$photo_pop_view.css('bottom', clientH * 0.05 + 'px');
$photo_pop_view.css('float', 'left');
$photo_pop_view.css('position', 'fixed');
$photo_pop_view.css('z-index', '100');
$photo_pop_view.css('display', 'none');
$('body').append($photo_pop_view);
//弹层图片区域
var $photo_pop_container = $('<div/>');
$photo_pop_container.css('left', '10%');
$photo_pop_container.css('width', '80%');
$photo_pop_container.css('top', '5%');
$photo_pop_container.css('height', '90%');
$photo_pop_container.css('overflow-y', 'auto');
$photo_pop_container.css('position', 'absolute');
$photo_pop_container.css('text-align', 'center');
$photo_pop_view.append($photo_pop_container);
//弹层大图
var $photo_pop_img = $('<img/>');
$photo_pop_img.css('display', 'inline-block');
$photo_pop_img.css('vertical-align', 'center');
$photo_pop_container.append($photo_pop_img);
//弹层评论区（包含评论与地理信息）
var $photo_pop_comment = $('<div/>');
$photo_pop_comment.css('background-color', 'white');
$photo_pop_comment.css('left', clientW * 0.68 + 'px');
$photo_pop_comment.css('right', clientW * 0.11 + 'px');
$photo_pop_comment.css('top', clientH * 0.05 + 'px');
$photo_pop_comment.css('bottom', clientH * 0.05 + 'px');
$photo_pop_comment.css('margin', '0px');
$photo_pop_comment.css('float', 'right');
$photo_pop_comment.css('text-align', 'center');
$photo_pop_comment.css('position', 'fixed');
$photo_pop_comment.css('z-index', '100');
$photo_pop_comment.css('display', 'none');
$('body').append($photo_pop_comment);
var $location = $('<p/>');
$photo_pop_comment.append($location);
var $dis = $('<p/>');
$photo_pop_comment.append($dis);
var $commentList = $('<div/>');
$commentList.css('background-color', '#eeeeee');
$commentList.css('position', 'absolute');
$commentList.css('width', '100%');
$commentList.css('height', '80%');
$photo_pop_comment.append($commentList);
var $prePage = $('<a id = "prepage">上一页</a>');
var $numPage = $('<p id = "numpage">1/3</p>');
var $nextPage = $('<a id = "nextpage">下一页</a>');
$photo_pop_comment.append($prePage);
$photo_pop_comment.append($numPage);
$photo_pop_comment.append($nextPage);
//弹层遮罩
var $photo_cover = $('<div/>');
$photo_cover.css('background-color', 'gray');
$photo_cover.css('opacity', '0.5');
$photo_cover.css('z-index', '1');
$photo_cover.css('left', '0px');
$photo_cover.css('top', '0px');
$photo_cover.css('position', 'absolute');
$photo_cover.css('width', documentW);
$photo_cover.css('height', documentH);
$photo_cover.css('display', 'none');
$('body').append($photo_cover);
//弹层关闭按钮
$closeButton = $('<img/>');
$closeButton.attr('src', "bg/close.png");
$closeButton.css('z-index', '101');
$closeButton.css('display', 'none');
$closeButton.css('position', 'fixed');
$('body').append($closeButton);
//获取评论
function getComment(index, num, json){
	var p = [];
	for(var i = 0; i < num; i++){
		var month = Math.random() * 100 % 12 + 1;
		month = Math.round(month);
		var day;
		switch(month){
			case 0:
				month ++;
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				day = Math.random() * 100 % 31 + 1;
				break;
			case 2:
				day = Math.random() * 100 % 28 + 1;
				break;
			case 13:
				month--;
			case 4:
			case 6:
			case 9:
			case 11:
				day = Math.random() * 100 % 30 + 1;
				break;
		}
		day = Math.round(day);
		p[i] = $('<div/>');
		var strn = json.name[index].n[i];
		var strc = json.comment[index].c[i];
		p[i].css('width', '100%');
		p[i].css('height', '20%');
		p[i].css('text-align', 'left');
		p[i].css('padding', '10px');
		p[i].css('margin-bottom', '3px');
		p[i].append('<p class = "name">' + strn + '</p>');
		p[i].append('<p class = "comment">' + strc + '</p>');
		p[i].append('<p class = "date">' + month + '月' + day + '日</p>');
		$commentList.append(p[i]);
	}
	$('.name').css('font-size', '12px');
	$('.name').css('color', '#00b7ee');
	$('.comment').css('font-size', '12px');
	$('.comment').css('display', 'inline-block');
	$('.date').css('font-size', '10px');
	$('.date').css('color', '#00b7ee');
	$('.date').css('position', 'absolute');
	$('.date').css('right', '10px');
}

//设置背景
var $bg = [];
for(var i = 0; i < 6; i++){
	var str = "url('bg/bg" + i + ".jpg')";
	$bg[i] = $('<div/>');
	$bg[i].css('background-image', str);
	$bg[i].css('background-repeat', 'repeat');
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
	if($photo_cover.css('display') === 'block'){
		document.body.scrollTop = curscrollTopPos;
	}
	documentH = $(document).height();
	clientH = $(window).height();
	for(var i = 0; i < 6; i++){
		$bg[i].css('height', documentH + 'px');
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
	if($(document).scrollTop() <= (documentH - clientH) && $(document).scrollTop() >= (documentH - clientH - 300) && scrollToBottomTimes == 1){
		$.getJSON("json/imageName30To59.json", function(json){
			setPhotos(30, json);
		});
		scrollToBottomTimes++;
	}
	else if($(document).scrollTop() <= (documentH - clientH) && $(document).scrollTop() >= (documentH - clientH - 300) && scrollToBottomTimes == 2){
		$.getJSON("json/imageName60To89.json", function(json){
			setPhotos(30, json);
		});
		scrollToBottomTimes++;
	}
	else if($(document).scrollTop() <= (documentH - clientH) && $(document).scrollTop() >= (documentH - clientH - 300) && scrollToBottomTimes == 3){
		$.getJSON("json/imageName90To119.json", function(json){
			setPhotos(30, json);
		});
		scrollToBottomTimes++;
	}
});
$('.lefttitlebg').css('width', $('.photo_column').css('width'));
$('.lefttitlebg').attr('alt', '图片加载失败');
$('.righttitlebg').css('width', $('.photo_column').css('width'));
$('.righttitlebg').attr('alt', '图片加载失败');
//点击图片查看大图事件以及鼠标悬停动画
for(var i = 0; i < 120; i++){
	$photo[i].mouseover(function(){
		$(this).css({'-webkit-animation': 'in 0.5s', 
					'animation-fill-mode': 'forwards'});
	});
	$photo[i].mouseout(function(){
		$(this).css({'-webkit-animation': 'out 0.5s', 
					'animation-fill-mode': 'forwards'});
	});
	$photo_box[i].click(function(){
		curPhotoIndex = $(this).find('img').eq(0).attr('id');
		documentH = $(document).height();
		$photo_cover.css('display', 'block');
		$photo_cover.css('height', documentH);
		$photo_pop_view.css('display', 'block');
		$photo_pop_comment.css('display', 'block');
		$photo_pop_img.attr('src', $(this).find('img').eq(0).attr('src'));
		if($photo_pop_img.height() < $photo_pop_view.height() * 0.9){
			$photo_pop_container.css('top', ($photo_pop_view.height() - $photo_pop_img.height()) / 2 + 'px');
			$photo_pop_container.css('height', $photo_pop_img.height());
		}
		$closeButton.css('display', 'block');
		$closeButton.css('right', parseFloat($photo_pop_comment.css('right')) - 10 + 'px');
		$closeButton.css('top', parseFloat($photo_pop_comment.css('top')) - 10 + 'px');
		$closeButton.css('width', '20px');
		$closeButton.css('height', '20px');
		curscrollTopPos = $(document).scrollTop();
		//设置评论区
		$numPage.text('1/3');
		$.getJSON('json/comment0To3.json', function(json){
			getComment(curPhotoIndex, 4, json);
		});
		if($numPage.text() === '1/3'){
			$prePage.css('color', 'gray');
			$prePage.css('cursor', 'text');
		}
		$.getJSON('json/location.json', function(json){
			var str1, str2;
			var la, lo;
			if(json.latitude[curPhotoIndex] > 0){
				str1 = '北';
				la = Math.round(json.latitude[curPhotoIndex]);
			}
			else{
				str1 = '南';
				la = -Math.round(json.latitude[curPhotoIndex]);
			}
			if(json.longitude[curPhotoIndex] > 0){
				str2 = '东';
				lo = Math.round(json.longitude[curPhotoIndex]);
			}
			else{
				str2 = '西';
				lo = -Math.round(json.longitude[curPhotoIndex]);
			}
			$location.text(str1 + '纬: ' + la + '° ' + str2 + '经: ' + lo + '°');
			if(navigator.geolocation)
    		{
    			navigator.geolocation.getCurrentPosition(computeDistance);
    		}
  			else{
  				alert("Geolocation is not supported by this browser.");
  			}
			function computeDistance(position)
  			{
  				var C = Math.sin(position.coords.latitude * 3.14 / 180) * Math.sin(la * 3.14 / 180) + 
  				Math.cos(position.coords.latitude * 3.14 / 180) * Math.cos(la * 3.14 / 180) * 
  				Math.cos((position.coords.longitude - lo) * 3.14 / 180);
				var Distance = 6371 * Math.acos(C);
				$dis.text('距您' + Math.round(Distance).toString() + '千米');
				return Distance;
			}
		});
	});
}
//点击遮罩层关闭弹层事件
$photo_cover.click(function(){
	$(this).css('display', 'none');
	$photo_pop_view.css('display', 'none');
	$photo_pop_comment.css('display', 'none');
	$closeButton.css('display', 'none');
	$commentList.empty();
});
//设置弹层关闭按钮事件
$closeButton.mouseover(function(){
	$(this).attr('src', 'bg/close_hover.png');
});
$closeButton.mouseout(function(){
	$(this).attr('src', 'bg/close.png');
});
$closeButton.mousedown(function(){
	$(this).attr('src', 'bg/close.png');
});
$closeButton.click(function(){
	$(this).attr('src', 'bg/close.png');
	$photo_cover.click();
});
//改变窗口大小事件
$(window).resize(function(){
	var curCliW = $(window).width();
	var curCliH = $(window).height();
	for(var i = 0; i < 4; i++){
		$photo_column[i].css('width', 200 * curCliW / clientW + 'px');
	}
	$('.lefttitlebg').css('width', 200 * curCliW / clientW + 'px');
	$('.righttitlebg').css('width', 200 * curCliW / clientW + 'px');
	$('.lefttitle').css('font-size', 60 * curCliW / clientW + 'px');
	$('.righttitle').css('font-size', 60 * curCliW / clientW + 'px');
	$('.leftsubtitle').css('font-size', 50 * curCliW / clientW + 'px');
	$('.rightsubtitle').css('font-size', 50 * curCliW / clientW + 'px');
	documentW = $(document).width();
	documentH = $(document).height();
	$waterfall.css('left', curCliW * 0.11 + 'px');
	$waterfall.css('right', curCliW * 0.11 + 'px');
	$photo_pop_view.css('left', curCliW * 0.11 + 'px');
	$photo_pop_view.css('right', curCliW * 0.3 + 'px');
	$photo_pop_view.css('top', curCliH * 0.05 + 'px');
	$photo_pop_view.css('bottom', curCliH * 0.05 + 'px');
	$photo_pop_comment.css('left', curCliW * 0.68 + 'px');
	$photo_pop_comment.css('right', curCliW * 0.11 + 'px');
	$photo_pop_comment.css('top', curCliH * 0.05 + 'px');
	$photo_pop_comment.css('bottom', curCliH * 0.05 + 'px');
	$photo_cover.css('width', documentW);
	$photo_cover.css('height', documentH);
});
//翻页事件
$prePage.click(function(){
	if($numPage.text() === '1/3'){
		return;
	}
	else if($numPage.text() === '2/3'){
		$commentList.empty();
		$.getJSON('json/comment0To3.json', function(json){
			getComment(curPhotoIndex, 4, json);
		});
		$numPage.text('1/3');
		$prePage.css('color', 'gray');
		$prePage.css('cursor', 'text');
	}
	else if($numPage.text() === '3/3'){
		$commentList.empty();
		$.getJSON('json/comment4To7.json', function(json){
			getComment(curPhotoIndex, 4, json);
		});
		$nextPage.css('color', '#6495ED');
		$nextPage.css('cursor', 'pointer');
		$numPage.text('2/3');
	}
});
$nextPage.click(function(){
	if($numPage.text() === '3/3'){
		return;
	}
	else if($numPage.text() === '2/3'){
		$commentList.empty();
		$.getJSON('json/comment8To10.json', function(json){
			getComment(curPhotoIndex, 3, json);
		});
		$numPage.text('3/3');
		$nextPage.css('color', 'gray');
		$nextPage.css('cursor', 'text');
	}
	else if($numPage.text() === '1/3'){
		$commentList.empty();
		$.getJSON('json/comment4To7.json', function(json){
			getComment(curPhotoIndex, 4, json);
		});
		$prePage.css('color', '#6495ED');
		$prePage.css('cursor', 'pointer');
		$numPage.text('2/3');
	}
});