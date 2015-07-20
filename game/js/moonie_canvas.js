//===========================================全局变量设定===============================================
//游戏结束标志
var isGameOver;
//关卡变量
var curLevel = 1;
//砖块总数
var blockNum = 0;
//设置主画布
var canvas = $('#myCanvas');
var cxt = canvas[0].getContext('2d');
cxt.save();
//设置中心画布
var center_canvas = $('#centerCanvas');
var center_cxt = center_canvas[0].getContext('2d');
center_canvas.css({
	'position': 'absolute',
	'left': '540px',
	'top': '170px'
});
center_cxt.translate(135, 141);
center_cxt.save();
//托条
var bar;
//小球
var ball;
//砖块数组
var map;
map = new Array(27);
for(var i = 0; i < 27; i++){
	map[i] = new Array(27);
	for(var j = 0; j < 27; j++){
		map[i][j] = new Block(i, j);
	}		
}
//动画ID
var animationID_1, animationID_2, animationID_in_1, animationID_in_2;
//===========================================界面绘制函数===============================================
//游戏界面设置函数
function initGame(){
	//设置游戏结束标志
	isGameOver = false;
	//设置主画布
	cxt.restore();
	cxt.save();
	//设置中心画布
	center_cxt.restore();
	center_cxt.save();
	//设置托条
	bar = new Bar(0, 0);
	//设置小球
	ball = new Ball();
	//设置砖块数组
	//绘制砖块(目前为铺满全屏，随机颜色)
	$.getJSON("json/level_" + curLevel + ".json", function(json){
		for(var i = 0; i < 27; i++){
			for(var j = 0; j < 27; j++){
				if(json.map[i][j] != '0'){
					var color;
					switch(json.map[i][j]){
					case '1':
						color = 'red';
						break;
					case '2':
						color = 'blue';
						break;
					case '3':
						color = 'yellow';
						break;
					case '4':
						color = 'green';
						break;
					case '5':
						color = 'orange';
						break;
					case '6':
						color = 'white';
						break;
					case '7':
						color = 'brown';
						break;
					case '8':
						color = 'cyan';
						break;
					case '9':
						color = 'purple';
						break;
					case '10':
						color = 'pink';
						break;
					case '11':
						color = 'gray';
						break;
					}
					map[i][j].color = color;
					drawBlock(j, i);
					blockNum++;
				}
			}
		}
	});
	//绘制中心及托条	
	drawBar(-74, -99);
	drawCenter();
	//绘制小球
	drawBall(ball);
	//设置动画
	animationID_1 = window.requestAnimationFrame(MainUpdate);	
	animationID_2 = window.requestAnimationFrame(CenterRotate);
}
//图片预加载函数
function preLoadImage(url, callback){
	var img = new Image();
	img.src = url;
	if(img.complete){	//图片已存在于缓存，直接调用回调函数
		callback.call(img);
		return;
	}
	else{
		img.onload = function(){
			callback.call(img);
		};
	}
}
//设置砖块的构造函数
function Block(row, column, color, bonus){
    this.row = row || 0;   //砖块所在行数，默认为0
    this.column = column || 0;   //砖块所在列数，默认为0
    this.color = color || 'red';	//砖块的颜色，默认为红色
    this.bonus = bonus || '';	//消除砖块的奖励，默认为空
    this.visible = false;	//砖块是否显示，默认为不显示
}
//设置托条的构造函数
function Bar(angle, translateAngle){
	this.angle = angle || 0;	//托条的朝向角度，范围为-180°——180°，默认值为0°
	this.translateAngle = translateAngle || 0;	//托条需要转过的角度，范围为-180°——180°，默认值为0°
	this.omega = 0;	//托条的角速度默认为0
}
//设置小球的构造函数
function Ball(angle, x, y, radius){
	this.angle = angle || 0;	//小球的飞行朝向角度，范围为0°——360°，默认值为0°
	this.radius = 12;	//小球的半径为12px
	this.x = x || 675 - this.radius;	//小球的x坐标，默认值为663
	this.y = y || 212 - 2 * this.radius;	//小球的y坐标，默认值为188
	this.isOnTheBar = true;	//小球初始状态在托条上
	this.speed = 3;	//小球的速度为10px/25ms = 0.4px/ms
}
//绘制砖块函数
function drawBlock(x, y){
    if(typeof cxt != "undefined"){
        preLoadImage('image/block_' + map[y][x].color + '.jpg', function(){
        	cxt.drawImage(this, x * 50, y * 23);
    		map[y][x].visible = true;
        });
    }
}
//绘制中心函数
function drawCenter(){
	if(typeof center_cxt != "undefined"){
		preLoadImage('image/center.png', function(){
			center_cxt.drawImage(this, -71, -71);
		});
	}
}
//绘制托条函数
function drawBar(x, y){
	if(typeof center_cxt != "undefined"){
		preLoadImage('image/bar.png', function(){
			center_cxt.drawImage(this, x, y);
		});
	}
}
//绘制小球函数
function drawBall(ball){
	if(!ball.isOnTheBar){
		if(typeof cxt != "undefined"){
			preLoadImage('image/ball.png', function(){
				cxt.drawImage(this, ball.x, ball.y);
			});
		}
	}
	else{
		if(typeof center_cxt != "undefined"){
			preLoadImage('image/ball.png', function(){
				center_cxt.drawImage(this, -12, -123);
			});
		}
	}
}
//当前游戏结束
function GameOver(){
	window.cancelAnimationFrame(animationID_1);
	window.cancelAnimationFrame(animationID_in_1);
	window.cancelAnimationFrame(animationID_2);
	window.cancelAnimationFrame(animationID_in_2);
	//判断砖块是否清空
	if(blockNum === 0){
		curLevel++;
	}
	else{
		alert("Game Over!");
	}
	initGame();
}
//===========================================碰撞检测===============================================
//判断小球是否与托条碰撞函数
function barCollisionDetect(){
	//计算小球下一时间点坐标
	var deltaX = ball.speed * Math.sin(ball.angle * Math.PI / 180);
	var deltaY = -ball.speed * Math.cos(ball.angle * Math.PI / 180);
	ball.x += deltaX;
	ball.y += deltaY;
	//将小球坐标转换到中心画布坐标系下并判断是否在圆内
	var ballX_center_coord = ball.x - 675;
	var ballY_center_coord = ball.y - 311;
	var ball_angle_center_coord = 0;
	if(Math.pow(ballX_center_coord, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 1.6, 2) + Math.pow(ballY_center_coord + 6, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 1.6, 2) + Math.pow(ballY_center_coord + 18, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 6, 2) + Math.pow(ballY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 6, 2) + Math.pow(ballY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord + 24, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 18, 2) + Math.pow(ballY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 18, 2) + Math.pow(ballY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 22.4, 2) + Math.pow(ballY_center_coord + 6, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 22.4, 2) + Math.pow(ballY_center_coord + 18, 2) <= Math.pow(99, 2) || 
		Math.pow(ballX_center_coord + 24, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(99, 2))
	{
		//小球预测位置在圆内，计算小球相对圆心的角度
		if(ballY_center_coord + ball.radius === 0){
			if(ballX_center_coord + ball.radius > 0){
				ball_angle_center_coord = Math.PI / 2;
			}
			else{
				ball_angle_center_coord = 3 * Math.PI / 2;
			}
		}
		else{
			ball_angle_center_coord = Math.atan((ballX_center_coord + ball.radius) / (-(ballY_center_coord + ball.radius)));
		}
		if(ballY_center_coord + ball.radius > 0){
			ball_angle_center_coord = ball_angle_center_coord + Math.PI;
		}
		else if(ball_angle_center_coord < 0){
			ball_angle_center_coord += 2 * Math.PI;
		}
		//弧度转角度
		ball_angle_center_coord = ball_angle_center_coord * 180 / Math.PI;
		//判断托条是否可以挡住小球，若能挡住则发生碰撞
		var angleDiffer;
		if(ball_angle_center_coord > 180){
			angleDiffer = ball_angle_center_coord - bar.angle - 360;
		}
		else{
			angleDiffer = ball_angle_center_coord - bar.angle;
		}
		if(angleDiffer < -180){
			angleDiffer += 360;
		}
		else if(angleDiffer > 180){
			angleDiffer -= 360;
		}
		if(angleDiffer <= 60 && angleDiffer >= -60){
			//托条能挡住小球，即发生碰撞
			var angle_In;
			if(ball_angle_center_coord < ball.angle){
				angle_In = Math.abs(ball_angle_center_coord + 180 - ball.angle);
			}
			else{
				angle_In = Math.abs(ball_angle_center_coord - 180 - ball.angle);
			}
			if((ball_angle_center_coord <= 180 && Math.abs(ball.angle - ball_angle_center_coord) < 180) || 
				(ball_angle_center_coord > 180 && Math.abs(ball.angle - ball_angle_center_coord) > 180)){
				ball.angle = ball_angle_center_coord + angle_In;
			}
			else{
				ball.angle = ball_angle_center_coord - angle_In;
			}
			ball.angle += bar.omega * 2;
			while(ball.angle > 360){
				ball.angle -= 360;
			}
			while(ball.angle < 0){
				ball.angle += 360;
			}
			ball.x -= deltaX;
			ball.y -= deltaY;
			ballX_center_coord = ball.x - 675;
			ballY_center_coord = ball.y - 311;
			deltaX = ball.speed * Math.sin(ball.angle * Math.PI / 180);
			deltaY = -ball.speed * Math.cos(ball.angle * Math.PI / 180);
			while(Math.pow(ballX_center_coord, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 1.6, 2) + Math.pow(ballY_center_coord + 6, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 1.6, 2) + Math.pow(ballY_center_coord + 18, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 6, 2) + Math.pow(ballY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 6, 2) + Math.pow(ballY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord + 24, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 18, 2) + Math.pow(ballY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 18, 2) + Math.pow(ballY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 22.4, 2) + Math.pow(ballY_center_coord + 6, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 22.4, 2) + Math.pow(ballY_center_coord + 18, 2) <= Math.pow(99, 2) || 
				Math.pow(ballX_center_coord + 24, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(99, 2))
			{
				ball.x += deltaX;
				ball.y += deltaY;
				ballX_center_coord = ball.x - 675;
				ballY_center_coord = ball.y - 311;
			}
			return true;
		}
		else if(Math.pow(ballX_center_coord, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(70, 2) && 
				Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord, 2) <= Math.pow(70, 2) && 
				Math.pow(ballX_center_coord + 12, 2) + Math.pow(ballY_center_coord + 24, 2) <= Math.pow(70, 2) && 
				Math.pow(ballX_center_coord + 24, 2) + Math.pow(ballY_center_coord + 12, 2) <= Math.pow(70, 2))
		{
			//小球完全进入中心，游戏结束
			isGameOver = true;
			GameOver();
		}
	}
	else{
		//小球预测位置不在圆内，不会与托条发生碰撞
		return false;
	}
}
//判断小球与砖块是否碰撞
function crashBlock(ballx,bally,changeX,changeY)
{
	if(ball.x + 2 * ball.radius >= 1350 || 
		ball.x <= 0 || 
		ball.y + 2 * ball.radius >= 621 || 
		ball.y <= 0){
		return null;
	}
	var judge = new Array();
	var isVisible = false;
	var xx, yy, disx, disy;
	if ((ball.angle >= 0) && (ball.angle < 90))
	{
		var xx1 = Math.floor((ballx + 12) / 50);
		var yy1 = Math.floor(bally / 23);
		var xx2 = Math.floor((ballx + 20.5) / 50);
		var yy2 = Math.floor((bally + 3.5) / 23);
		var xx3 = Math.floor((ballx + 24) / 50);
		var yy3 = Math.floor((bally + 12) / 23);
		if(map[yy1][xx1].visible){
			xx = xx1;
			yy = yy1;
			isVisible = true;
			disx = 1;
			disy = 0;
		}
		else if(map[yy3][xx3].visible){
			xx = xx3;
			yy = yy3;
			isVisible = true;
			disx = 0;
			disy = 1;
		}
		else if(map[yy2][xx2].visible){
			xx = xx2;
			yy = yy2;
			isVisible = true;
			disx = Math.abs(xx * 50 - ballx + changeX - 20.5);
			disy = Math.abs((yy + 1) * 23 - bally + changeY - 3.5);
		}
		if (isVisible)
		{
			judge[1] = yy;
			judge[2] = xx;
			if (disy > disx)
			{
				if (!map[yy][xx - 1].visible) judge[0] = 'y';
				else judge[0] = 'x';
			}
			else
			{
				if(!map[yy + 1][xx].visible) judge[0] = 'x';
				else judge[0] = 'y';
			}
		}
	}

	else if ((ball.angle >= 90) && (ball.angle < 180))
	{
		var xx1 = Math.floor((ballx + 24) / 50);
		var yy1 = Math.floor((bally + 12) / 23);
		var xx2 = Math.floor((ballx + 20.5) / 50);
		var yy2 = Math.floor((bally + 20.5) / 23);
		var xx3 = Math.floor((ballx + 12) / 50);
		var yy3 = Math.floor((bally + 24) / 23);
		if(map[yy3][xx3].visible){
			xx = xx3;
			yy = yy3;
			isVisible = true;
			disx = 1;
			disy = 0;
		}
		else if(map[yy1][xx1].visible){
			xx = xx1;
			yy = yy1;
			isVisible = true;
			disx = 0;
			disy = 1;
		}
		else if(map[yy2][xx2].visible){
			xx = xx2;
			yy = yy2;
			isVisible = true;
			disx = Math.abs(xx * 50 - ballx + changeX - 20.5);
			disy = Math.abs(yy * 23 - bally + changeY - 20.5);
		}
		if (isVisible)
		{
			judge[1] = yy;
			judge[2] = xx;
			if (disy > disx)
			{
				if (!map[yy][xx - 1].visible) judge[0] = 'y';
				else judge[0] = 'x';
			}
			else
			{
				if(!map[yy - 1][xx].visible) judge[0] = 'x';
				else judge[0] = 'y';
			}
		}
	}

	else if ((ball.angle >= 180) && (ball.angle < 270))
	{
		var xx1 = Math.floor(ballx / 50);
		var yy1 = Math.floor((bally + 12) / 23);
		var xx2 = Math.floor((ballx + 3.5) / 50);
		var yy2 = Math.floor((bally + 20.5) / 23);
		var xx3 = Math.floor((ballx + 12) / 50);
		var yy3 = Math.floor((bally + 24) / 23);
		if(map[yy3][xx3].visible){
			xx = xx3;
			yy = yy3;
			isVisible = true;
			disx = 1;
			disy = 0;
		}
		else if(map[yy1][xx1].visible){
			xx = xx1;
			yy = yy1;
			isVisible = true;
			disx = 0;
			disy = 1;
		}
		else if(map[yy2][xx2].visible){
			xx = xx2;
			yy = yy2;
			isVisible = true;
			disx = Math.abs(xx * 50 - ballx + changeX - 3.5);
			disy = Math.abs((yy + 1) * 23 - bally + changeY - 20.5);
		}
		if (isVisible)
		{
			judge[1] = yy;
			judge[2] = xx;
			if (disy > disx)
			{
				if (!map[yy][xx + 1].visible) judge[0] = 'y';
				else judge[0] = 'x';
			}
			else
			{
				if(!map[yy - 1][xx].visible) judge[0] = 'x';
				else judge[0] = 'y';
			}
		}
	}

	else if ((ball.angle >= 270) && (ball.angle <= 360))
	{
		var xx1 = Math.floor(ballx / 50);
		var yy1 = Math.floor((bally + 12) / 23);
		var xx2 = Math.floor((ballx + 3.5) / 50);
		var yy2 = Math.floor((bally + 3.5) / 23);
		var xx3 = Math.floor((ballx + 12) / 50);
		var yy3 = Math.floor(bally / 23);
		if(map[yy3][xx3].visible){
			xx = xx3;
			yy = yy3;
			isVisible = true;
			disx = 1;
			disy = 0;
		}
		else if(map[yy1][xx1].visible){
			xx = xx1;
			yy = yy1;
			isVisible = true;
			disx = 0;
			disy = 1;
		}
		else if(map[yy1][xx1].visible){
			xx = xx1;
			yy = yy1;
			isVisible = true;
			disx = Math.abs((xx + 1) * 50 - ballx + changeX - 3.5);
			disy = Math.abs((yy + 1) * 23 - bally + changeY - 3.5);
		}
		if (isVisible)
		{
			judge[1] = yy;
			judge[2] = xx;
			if (disy > disx)
			{
				if (!map[yy][xx + 1].visible) judge[0] = 'y';
				else judge[0] = 'x';
			}
			else
			{
				if(!map[yy + 1][xx].visible) judge[0] = 'x';
				else judge[0] = 'y';
			}
		}
	}
	if (judge.length > 0)
		return (judge);
	else 
		return (null);
}
//小球碰到砖块后，改变小球飞行角度
function changeBallAngle(ballAngle,direction)
{
	if (ballAngle == 90) return(ballAngle + 180);
	if (ballAngle == 180) return(ballAngle - 180);
	if (ballAngle == 270) return(ballAngle - 180);
	if (ballAngle == 0) return(ballAngle + 180);
	//碰见了竖边
	if ((ballAngle > 0) && (ballAngle < 90) && (direction == 'y'))
		return(360 - ballAngle);
	//碰见了横边
	if ((ballAngle > 0) && (ballAngle < 90) && (direction == 'x'))
		return(180 - ballAngle);
	//碰见了竖边
	if ((ballAngle > 90) && (ballAngle < 180) && (direction == 'y'))
		return(360 - ballAngle);
	//碰见了横边
	if ((ballAngle > 90) && (ballAngle < 180) && (direction == 'x'))
		return(180 - ballAngle);
	//碰见了竖边
	if ((ballAngle > 180) && (ballAngle < 270) && (direction == 'y'))
		return(360 - ballAngle);
	//碰见了横边
	if ((ballAngle > 180) && (ballAngle < 270) && (direction == 'x'))
		return(540 - ballAngle);
	//碰见了竖边
	if ((ballAngle > 270) && (ballAngle < 360) && (direction == 'y'))
		return(360 - ballAngle);
	//碰见了横边
	if ((ballAngle > 270) && (ballAngle < 360) && (direction == 'x'))
		return(540 - ballAngle);
}
//===========================================事件监听===============================================
//鼠标移动事件，确定鼠标的方位以及托条需要转过的角度
$(window).mousemove(function(event){
	var mouseX = event.pageX;
	var mouseY = event.pageY;
	var targetAngle = 0;
	if(mouseY === 311){
		if(mouseX > 675){
			targetAngle = Math.PI / 2;
		}
		else{
			targetAngle = -Math.PI / 2;
		}
	}
	else if(mouseY < 311){
		targetAngle = Math.atan((mouseX - 675) / (311 - mouseY));
	}
	else{
		targetAngle = Math.atan((mouseX - 675) / (mouseY - 311));
		if(targetAngle < 0){
			targetAngle = -targetAngle - Math.PI;
		}
		else{
			targetAngle = Math.PI - targetAngle;
		}
	}
	bar.translateAngle = Math.round(targetAngle * 180 / Math.PI) - bar.angle;
	if(bar.translateAngle > 180){
		bar.translateAngle -= 360;
	}
	else if(bar.translateAngle < -180){
		bar.translateAngle += 360;
	}
});
//持续刷新主画布，更新小球位置，砖块以及奖励下落
$(window).keyup(function(event){
	if(event.keyCode === 32){
		if(ball.isOnTheBar)
			ball.isOnTheBar = false;
		else{
			if(ball.y === 311){
				if(ball.x < 675){
					ball.angle = 90;
				}
				else{
					ball.angle = 270;
				}
			}
			else if(ball.y < 311){
				ball.angle = Math.atan((675 - ball.x) / (ball.y - 311)) * 180 / Math.PI;
				ball.angle += 180;
			}
			else if(ball.y > 311){
				ball.angle = Math.atan((675 - ball.x) / (ball.y - 311)) * 180 / Math.PI;
			}
		}
	}
});
//===========================================动画设置===============================================
function MainUpdate(){
	cancelAnimationFrame(animationID_in_1);
	//若小球不在托条上，则更新相应部分的画布，否则不更新
	if(!ball.isOnTheBar){
		//获取小球当前位置
		var curX = ball.x;
		var curY = ball.y;
		console.log(curX);
		console.log(curY);
		//判断是否出界
		if(ball.x >= 1360 || 
			ball.x + 2 * ball.radius <= -10 || 
			ball.y >= 663 || 
			ball.y + 2 * ball.radius <= -10){
			isGameOver = true;
			cxt.clearRect(curX, curY, 2 * ball.radius, 2 * ball.radius);
			GameOver();
			return;
		}
		//判断是否发生碰撞
		var judgeCrashBlock;
		if(!barCollisionDetect()){
			var deltaX = ball.speed * Math.sin(ball.angle * Math.PI / 180);
			var deltaY = -ball.speed * Math.cos(ball.angle * Math.PI / 180);
			ball.x += deltaX;
			ball.y += deltaY;
			judgeCrashBlock = crashBlock(ball.x, ball.y, deltaX, deltaY);
		}
		else{
			judgeCrashBlock = crashBlock(ball.x, ball.y, 0, 0);
		}
		if (judgeCrashBlock != null)
		{
			map[judgeCrashBlock[1]][judgeCrashBlock[2]].visible = false;
			blockNum--;
			cxt.clearRect(judgeCrashBlock[2] * 50, judgeCrashBlock[1] * 23, 50, 23);
			ball.angle = changeBallAngle(ball.angle,judgeCrashBlock[0]);
			ball.x -= deltaX;
			ball.y -= deltaY;
		}
		//清空画布
		cxt.clearRect(curX, curY, 2 * ball.radius, 2 * ball.radius);
		//判断该区域内的砖块是否需要显示并绘制
		for(var i = Math.floor(curY / 23); i < Math.ceil((curY + 2 * ball.radius) / 23); i++){
			for(var j = Math.floor(curX / 50); j < Math.ceil((curX + 2 * ball.radius) / 50); j++){
				if(i >= 0 && i < 27 && j >= 0 && j < 27 && map[i][j].visible){
					drawBlock(j, i);
				}
			}
		}
		if(blockNum === 0){
			isGameOver = true;
			GameOver();
		}
		//绘制小球
		drawBall(ball);
	}
	animationID_in_1 = window.requestAnimationFrame(MainUpdate);
}
//持续刷新中心画布，让托条跟随鼠标移动
function CenterRotate(){
	window.cancelAnimationFrame(animationID_in_2);
	//清空画布
	center_cxt.clearRect(-135, -141, 300, 300);
	//旋转到相应角度并更新托条的角度
	center_cxt.rotate(bar.translateAngle * Math.PI / 180);
	bar.angle += bar.translateAngle;
	if(bar.angle > 180){
		bar.angle -= 360;
	}
	if(bar.angle < -180){
		bar.angle += 360;
	}
	if(ball.isOnTheBar){
		var oldArg = ball.angle;
		ball.angle += bar.translateAngle;
		if(ball.angle > 360){
			ball.angle -= 360;
		}
		if(ball.angle < 0){
			ball.angle += 360;
		}
		ball.x += 113 * Math.sin(ball.angle * Math.PI / 180) - 113 * Math.sin(oldArg * Math.PI / 180);
		ball.y -= 113 * Math.cos(ball.angle * Math.PI / 180) - 113 * Math.cos(oldArg * Math.PI / 180);
	}
	bar.omega = bar.translateAngle;
	bar.translateAngle = 0;
	//绘制托条，中心，若小球在托条上，则绘制小球
	drawBar(-74, -99);
	drawCenter();
	if(ball.isOnTheBar){
		drawBall(ball);
	}
	animationID_in_2 = window.requestAnimationFrame(CenterRotate);
}