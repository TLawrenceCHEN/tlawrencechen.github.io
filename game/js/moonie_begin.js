var clearPositionLeft = 665;
var clearPositionRight = 675;
//获取开始界面画布
var canvas_begin = $('#begin');
var cxt_begin = canvas_begin[0].getContext('2d');
//获取标题
var title = $('<img src="image/title.png"/>');
title.css({
	'position': 'fixed',
	'left': '250px',
	'top': '0px'
});
$('body').append(title);
//获取开始按钮
var beginButton = $('<button id="beginButton"/>');
beginButton.text('开始游戏');
$('body').append(beginButton);
//获取帮助按钮
var helpButton = $('<button id="help"/>');
helpButton.text('帮助');
$('body').append(helpButton);
//获取帮助信息
var helpInfoLeft = $('<div id="infoLeft"/>');
helpInfoLeft.css('display', 'none');
helpInfoLeft.append('<p>SPACE：释放小球/拉回小球</p>').
			append('<p>ENTER: 暂停游戏</p>').
			append('<p>鼠标移动控制托条方位</p>').
			append('<p>小球落入中心黑洞或逃离边界之外损失生命。总计4条生命，全部损失游戏结束</p>');
$('body').append(helpInfoLeft);
var helpInfoRight = $('<div id="infoRight"/>');
helpInfoRight.css('display', 'none');
helpInfoRight.append('<p>道具简介：</p>').
			append('<p><img src="image/dead.png"/>：获得后立即失去一条生命</p>').
			append('<p><img src="image/speedup.png"/>：获得后小球加速</p>').
			append('<p><img src="image/slowdown.png"/>：获得后小球减速</p>').
			append('<p><img src="image/three.png"/>：获得后分裂为3个小球</p>').
			append('<p><img src="image/cross.png"/>：获得后小球碰撞砖块不改变角度</p>');
$('body').append(helpInfoRight);
//绘制开始界面
drawBegin();
function drawBegin(){
	if(typeof cxt_begin != "undefined"){
		preLoadImage('image/begin.jpg', function(){
			cxt_begin.drawImage(this, 0, 0);
		});
	}
	beginButton.css('display', 'block');
	helpButton.css('display', 'block');
	title.css('display', 'block');
}
//绑定点击事件
beginButton.click(function(){
	requestAnimationFrame(MoveSide);
	beginButton.css('display', 'none');
	helpButton.css('display', 'none');
	title.css('display', 'none');
});
function MoveSide(){
	cxt_begin.clearRect(clearPositionLeft, 0, 10, 666);
	cxt_begin.clearRect(clearPositionRight, 0, 10, 666);
	clearPositionLeft -= 10;
	clearPositionRight += 10;
	if(clearPositionLeft >= -10 || clearPositionRight <= 1375){
		requestAnimationFrame(MoveSide);
	}
	else{
		clearPositionLeft = 665;
		clearPositionRight = 675;
		initGame();
	}
}
//绑定鼠标移进移出界面
$('button').mouseover(function(){
	$(this).css({
		'background-color': 'white',
		'color': 'black'
	});
	if($(this).attr('id') === 'help'){
		helpInfoLeft.fadeIn();
		helpInfoRight.fadeIn();
	}
});
$('button').mouseout(function(){
	$(this).css({
		'background-color': 'transparent',
		'color': 'white'
	});
	if($(this).attr('id') === 'help'){
		helpInfoLeft.fadeOut();
		helpInfoRight.fadeOut();
	}
});