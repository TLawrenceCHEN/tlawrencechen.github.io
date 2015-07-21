//设置过渡按钮
var nextLevelButton = $('#next');
var backToBeginning = $('#back');
//设置点击事件
nextLevelButton.click(function(){
	$('#pass').css({
		'left': '675px',
		'top': '311px',
		'width': '0px',
		'height': '0px',
		'display': 'none'
	});
	$('#next').css('display', 'none');
	$('#back').css('display', 'none');
	initGame();
});
backToBeginning.click(function(){
	curLevel = 1;
	$('#myCanvas').css('display', 'none');
	$('#centerCanvas').css('display', 'none');
	$('#pass').css({
		'left': '675px',
		'top': '311px',
		'width': '0px',
		'height': '0px',
		'display': 'none'
	});
	$('#over').css({
		'left': '675px',
		'top': '311px',
		'width': '0px',
		'height': '0px',
		'display': 'none'
	});
	$('#next').css('display', 'none');
	$('#back').css('display', 'none');
	drawBegin();	
});