//===========================================全局变量设定===============================================
//游戏结束标志
var isGameOver;
//游戏暂停标志
var isPause;
//关卡变量
var curLevel = 5;
//砖块总数
var blockNum = 0;
//指示界面中是否有Bonus
var bonusAdded = false;
//指示界面中是否有3个球
var ballsAdded = false;
//Bonus变量
var bonus;
//三个球
var ball1;
var ball2;
//界面中球的个数
var totalBall = 1;
//生命值
var lives = 4;
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
/*球ball的动画ID*/
var animationID_1, animationID_in_1;
/*中央滚动条的动画ID*/
var animationID_2, animationID_in_2;
/*球ball1的动画ID*/
var animationID_Ball1, animationID_in_Ball1;
/*球ball2的动画ID*/
var animationID_Ball2, animationID_in_Ball2;
//bonus的动画ID
var animationID_Bonus, animationID_in_Bonus;
//===========================================界面绘制函数===============================================
//游戏界面设置函数
function initGame(){
	//显示画布
	canvas.css('display', 'block');
	center_canvas.css('display', 'block');
	//重置砖块数
	blockNum = 0;
	//设置显示生命数
	$('#life').text('生命：' + lives);
	//设置游戏结束标志
	isGameOver = false;
	//设置游戏暂停标志
	isPause = false;
	//设置主画布
	cxt.restore();
	cxt.save();
	cxt.clearRect(0, 0, 1360, 663);
	//设置中心画布
	center_cxt.restore();
	center_cxt.save();
	//设置托条
	bar = new Bar(0, 0);
	//设置小球
	ball = new Ball();
	//指示关卡数
	curLevel = 1;
	//指示界面中是否有Bonus
	bonusAdded = false;
	//指示界面中是否有3个球
	ballsAdded = false;
	//界面中球的个数
	totalBall = 1;
	//从json中读取砖块布局并绘制砖块
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
	//设置Bonus
	setBonus();
	//绘制中心及托条	
	drawBar(-74, -99);
	drawCenter();
	//绘制小球
	drawBall(ball);
	//设置动画
	animationID_1 = window.requestAnimationFrame(MainUpdate);	
	animationID_2 = window.requestAnimationFrame(CenterRotate);
	//animationID_Ball1 = window.requestAnimationFrame(BallOneUpdate);
	//animationID_Ball2 = window.requestAnimationFrame(BallTwoUpdate);
}

//生命值未用完之前加载
function initOldGame(){
	$('#life').text('生命：' + lives);
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
	//指示界面中是否有Bonus
	bonusAdded = false;
	//指示界面中是否有3个球
	ballsAdded = false;
	//界面中球的个数
	totalBall = 1;
	//绘制砖块
	for (var i = 0; i < 27; i++)
		for (var j = 0; j < 27; j++)
		{
			if (map[i][j].visible)
				drawBlock(j, i, map[i][j].color);
		}
	//绘制中心及托条	
	drawBar(-74, -99);
	drawCenter();
	//绘制小球
	drawBall(ball);
	//设置动画
	animationID_1 = window.requestAnimationFrame(MainUpdate);	
	animationID_2 = window.requestAnimationFrame(CenterRotate);
	//animationID_Ball1 = window.requestAnimationFrame(BallOneUpdate);
	//animationID_Ball2 = window.requestAnimationFrame(BallTwoUpdate);
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
	this.needToChangeAngle = true;
}

//设置bonus数组
function Bonus(angle,kind,x,y)
{
	this.angle = angle || 0;
	this.x = x;
	this.y = y;
	this.speed = 2;
	this.radius = 12;
	this.kind = kind || '';
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

//绘制bonus
function drawBonus(bonus){
	var imgLoad;
	switch (bonus.kind){
		case "speed_up":
		imgLoad = 'image/speedup.png';
		break;

		case "speed_down":
		imgLoad = 'image/slowdown.png';
		break;

		case "three_balls":
		imgLoad = 'image/three.png';
		break;

		case "iron_ball":
		imgLoad = 'image/iron_ball.png';
		break;

		case "gameover":
		imgLoad = 'image/gameover.png';
		break;

		default:
		break;
	}
	if(typeof cxt != "undefined"){
		preLoadImage(imgLoad, function(){
			cxt.drawImage(this, bonus.x, bonus.y);
		});
	}
}

//当前游戏结束
function GameOver(){

	//清空动画
	window.cancelAnimationFrame(animationID_1);
	window.cancelAnimationFrame(animationID_in_1);
	window.cancelAnimationFrame(animationID_2);
	window.cancelAnimationFrame(animationID_in_2);
	window.cancelAnimationFrame(animationID_Ball1);
	window.cancelAnimationFrame(animationID_in_Ball1);
	window.cancelAnimationFrame(animationID_Ball2);
	window.cancelAnimationFrame(animationID_in_Ball2);
	//判断砖块是否清空
	if (typeof ball != "undefined") cxt.clearRect(ball.x, ball.y, 2 * ball.radius, 2 * ball.radius);
	if (typeof ball1 != "undefined") cxt.clearRect(ball1.x, ball1.y, 2 * ball1.radius, 2 * ball1.radius);
	if (typeof ball2 != "undefined") cxt.clearRect(ball2.x, ball2.y, 2 * ball2.radius, 2 * ball2.radius);
	if (typeof bonus != "undefined") cxt.clearRect(bonus.x, bonus.y, 2 * bonus.radius, 2 * bonus.radius);
	bonus = undefined;
	ball = undefined;
	ball1 = undefined;
	ball2 = undefined;
	if(blockNum === 0){
		$('#pass').css('display', 'block');
		$('#pass').animate({
			left: '250px',
			top: '170px',
			width: '800px',
			height: '281px'
		});
		$('#next').css('display', 'block');
		$('#back').css('left', '450px');
		$('#back').css('display', 'block');
		curLevel++;
	}
	else{
		lives = lives - 1;
		if (lives != 0)
		{
			initOldGame();
			return;
		}
		else{
			lives = 4;
			$('#over').css('display', 'block');
			$('#over').animate({
				left: '250px',
				top: '170px',
				width: '800px',
				height: '281px'
			});
			curLevel = 1;
			$('#back').css('left', '575px');
			$('#back').css('display', 'block');	
		}
	}
}
//===========================================碰撞检测===============================================
//判断小球ball是否与托条碰撞函数
function barCollisionDetect_Ball(ball){
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
			totalBall = totalBall - 1;
			window.cancelAnimationFrame(animationID_1);
			window.cancelAnimationFrame(animationID_in_1);
			ball = undefined;
			if (totalBall == 0)
			{
				isGameOver = true;
				GameOver();
				return true;
			}
			return true;
		}
	}
	else{
		//小球预测位置不在圆内，不会与托条发生碰撞
		return false;
	}
}

//判断小球ball1是否与托条碰撞函数
function barCollisionDetect_Ball1(ball){
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
			totalBall = totalBall - 1;
			window.cancelAnimationFrame(animationID_Ball1);
			window.cancelAnimationFrame(animationID_in_Ball1);
			ball1 = undefined;
			if (totalBall == 0)
			{
				isGameOver = true;
				GameOver();
				return true;
			}
			return true;
		}
	}
	else{
		//小球预测位置不在圆内，不会与托条发生碰撞
		return false;
	}
}

//判断小球ball1是否与托条碰撞函数
function barCollisionDetect_Ball2(ball){
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
			totalBall = totalBall - 1;
			window.cancelAnimationFrame(animationID_Ball2);
			window.cancelAnimationFrame(animationID_in_Ball2);
			ball2 = undefined;
			if (totalBall == 0)
			{
				isGameOver = true;
				GameOver();
				return true;
			}
			return true;
		}
	}
	else{
		//小球预测位置不在圆内，不会与托条发生碰撞
		return false;
	}
}
//判断小球与砖块是否碰撞
function crashBlock(ball,ballx,bally,changeX,changeY)
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
		if (typeof ball != "undefined")
		{
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

		if (typeof ball1 != "undefined")
		{
			if(ball1.isOnTheBar)
				ball1.isOnTheBar = false;
			else{
				if(ball1.y === 311){
					if(ball1.x < 675){
						ball1.angle = 90;
					}
					else{
						ball1.angle = 270;
					}
				}
				else if(ball1.y < 311){
					ball1.angle = Math.atan((675 - ball1.x) / (ball1.y - 311)) * 180 / Math.PI;
					ball1.angle += 180;
				}
				else if(ball1.y > 311){
					ball1.angle = Math.atan((675 - ball1.x) / (ball1.y - 311)) * 180 / Math.PI;
				}
			}
		}

		if (typeof ball2 != "undefined")
		{
			if(ball2.isOnTheBar)
				ball2.isOnTheBar = false;
			else{
				if(ball2.y === 311){
					if(ball2.x < 675){
						ball2.angle = 90;
					}
					else{
						ball2.angle = 270;
					}
				}
				else if(ball2.y < 311){
					ball2.angle = Math.atan((675 - ball2.x) / (ball2.y - 311)) * 180 / Math.PI;
					ball2.angle += 180;
				}
				else if(ball2.y > 311){
					ball2.angle = Math.atan((675 - ball2.x) / (ball2.y - 311)) * 180 / Math.PI;
				}
			}	
		}
	}
	if(event.keyCode === 13){
		if(!isPause){
			isPause = true;
			window.cancelAnimationFrame(animationID_1);
			window.cancelAnimationFrame(animationID_in_1);
			window.cancelAnimationFrame(animationID_2);	
			window.cancelAnimationFrame(animationID_in_2);
			if (bonusAdded)
			{
				window.cancelAnimationFrame(animationID_Bonus);
				window.cancelAnimationFrame(animationID_in_Bonus);
			}

			if (ballsAdded)
			{
				window.cancelAnimationFrame(animationID_Ball1);
				window.cancelAnimationFrame(animationID_in_Ball1);
				window.cancelAnimationFrame(animationID_Ball2);	
				window.cancelAnimationFrame(animationID_in_Ball2);
			}

			center_cxt.save();
			center_cxt.rotate(-bar.angle * Math.PI / 180);
			center_cxt.fillStyle = 'white';
			center_cxt.fillRect(-30, -40, 15, 80);
			center_cxt.fillRect(15, -40, 15, 80);
			center_cxt.restore();		
		}
		else{
			isPause = false;
			animationID_1 = window.requestAnimationFrame(MainUpdate);
			animationID_2 = window.requestAnimationFrame(CenterRotate);
			if (bonusAdded)
			{
				animationID_Bonus = window.requestAnimationFrame(BonusRotate);
			}

			if (ballsAdded)
			{
				animationID_Ball1 = window.requestAnimationFrame(BallOneUpdate);
				animationID_Ball2 = window.requestAnimationFrame(BallTwoUpdate);
			}
			drawCenter();
		}
	}
});

//===========================================动画设置===============================================
//第一个小球ball的动画
function MainUpdate(){
	cancelAnimationFrame(animationID_in_1);
	//若小球不在托条上，则更新相应部分的画布，否则不更新
	if(!ball.isOnTheBar){
		//获取小球当前位置
		var curX = ball.x;
		var curY = ball.y;
		//判断是否出界
		if(ball.x >= 1360 || 
			ball.x + 2 * ball.radius <= -10 || 
			ball.y >= 663 || 
			ball.y + 2 * ball.radius <= -10){
			totalBall = totalBall - 1;
		    if (totalBall == 0)
		    {
		    	isGameOver = true;
		    	cxt.clearRect(curX, curY, 2 * ball.radius, 2 * ball.radius);
		    	GameOver();
		    }
			return;
		}
		//判断是否发生碰撞
		var judgeCrashBlock;
		if(!barCollisionDetect_Ball(ball)){
			var deltaX = ball.speed * Math.sin(ball.angle * Math.PI / 180);
			var deltaY = -ball.speed * Math.cos(ball.angle * Math.PI / 180);
			ball.x += deltaX;
			ball.y += deltaY;
			judgeCrashBlock = crashBlock(ball, ball.x, ball.y, deltaX, deltaY);
		}
		else if(isGameOver){
			return;
		}
		else{
			judgeCrashBlock = crashBlock(ball, ball.x, ball.y, 0, 0);
		}
		if (judgeCrashBlock != null)
		{
			map[judgeCrashBlock[1]][judgeCrashBlock[2]].visible = false;
			blockNum--;
			cxt.clearRect(judgeCrashBlock[2] * 50, judgeCrashBlock[1] * 23, 50, 23);
			if (ball.needToChangeAngle) ball.angle = changeBallAngle(ball.angle,judgeCrashBlock[0]);
			ball.x -= deltaX;
			ball.y -= deltaY;
			addCrashMusic();
			if ((!bonusAdded) && (map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus != ''))
			{
				bonusAdded = true;
				animationID_Bonus = window.requestAnimationFrame(BonusRotate);
				bonus = new Bonus(0,map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus,
					judgeCrashBlock[2] * 50,judgeCrashBlock[1] * 23);
				if(bonus.y === 311){
					if(bonus.x < 675){
						bonus.angle = 90;
					}
					else{
						bonus.angle = 270;
					}
				}
				else if(bonus.y < 311){
					bonus.angle = Math.atan((675 - ball.x) / (ball.y - 311)) * 180 / Math.PI;
					bonus.angle += 180;
				}
				else if(bonus.y > 311){
					bonus.angle = Math.atan((675 - ball.x) / (ball.y - 311)) * 180 / Math.PI;
				}
			}
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
			return;
		}
		//绘制小球
		drawBall(ball);
	}
	animationID_in_1 = window.requestAnimationFrame(MainUpdate);
}

//第二个小球ball1的动画
function BallOneUpdate(){
	cancelAnimationFrame(animationID_in_Ball1);
	//若小球不在托条上，则更新相应部分的画布，否则不更新
	if(!ball1.isOnTheBar){
		//获取小球当前位置
		var curX = ball1.x;
		var curY = ball1.y;
		//判断是否出界
		if(ball1.x >= 1360 || 
			ball1.x + 2 * ball1.radius <= -10 || 
			ball1.y >= 663 || 
			ball1.y + 2 * ball1.radius <= -10){
			totalBall = totalBall - 1;
		    if (totalBall == 0)
		    {
		    	isGameOver = true;
		    	cxt.clearRect(curX, curY, 2 * ball1.radius, 2 * ball1.radius);
		    	GameOver();
		    }
			return;
		}
		//判断是否发生碰撞
		var judgeCrashBlock;
		if(!barCollisionDetect_Ball1(ball1)){
			var deltaX = ball1.speed * Math.sin(ball1.angle * Math.PI / 180);
			var deltaY = -ball1.speed * Math.cos(ball1.angle * Math.PI / 180);
			ball1.x += deltaX;
			ball1.y += deltaY;
			judgeCrashBlock = crashBlock(ball1, ball1.x, ball1.y, deltaX, deltaY);
		}
		else if(isGameOver){
			return;
		}
		else{
			judgeCrashBlock = crashBlock(ball1,ball1.x, ball1.y, 0, 0);
		}
		if (judgeCrashBlock != null)
		{
			map[judgeCrashBlock[1]][judgeCrashBlock[2]].visible = false;
			blockNum--;
			cxt.clearRect(judgeCrashBlock[2] * 50, judgeCrashBlock[1] * 23, 50, 23);
			if (ball1.needToChangeAngle) ball1.angle = changeBallAngle(ball1.angle,judgeCrashBlock[0]);
			ball1.x -= deltaX;
			ball1.y -= deltaY;
			addCrashMusic();
			if ((!bonusAdded) && (map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus != ''))
			{
				bonusAdded = true;
				animationID_Bonus = window.requestAnimationFrame(BonusRotate);
				bonus = new Bonus(0,map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus,
					judgeCrashBlock[2] * 50,judgeCrashBlock[1] * 23);
				if(bonus.y === 311){
					if(bonus.x < 675){
						bonus.angle = 90;
					}
					else{
						bonus.angle = 270;
					}
				}
				else if(bonus.y < 311){
					bonus.angle = Math.atan((675 - ball1.x) / (ball1.y - 311)) * 180 / Math.PI;
					bonus.angle += 180;
				}
				else if(bonus.y > 311){
					bonus.angle = Math.atan((675 - ball1.x) / (ball1.y - 311)) * 180 / Math.PI;
				}
			}
		}
		//清空画布
		cxt.clearRect(curX, curY, 2 * ball1.radius, 2 * ball1.radius);
		//判断该区域内的砖块是否需要显示并绘制
		for(var i = Math.floor(curY / 23); i < Math.ceil((curY + 2 * ball1.radius) / 23); i++){
			for(var j = Math.floor(curX / 50); j < Math.ceil((curX + 2 * ball1.radius) / 50); j++){
				if(i >= 0 && i < 27 && j >= 0 && j < 27 && map[i][j].visible){
					drawBlock(j, i);
				}
			}
		}
		if(blockNum === 0){
			isGameOver = true;
			GameOver();
			return;
		}
		//绘制小球
		drawBall(ball1);
	}
	animationID_in_Ball1 = window.requestAnimationFrame(BallOneUpdate);
}

//第二个小球Ball2的动画
function BallTwoUpdate(){
	cancelAnimationFrame(animationID_in_Ball2);
	//若小球不在托条上，则更新相应部分的画布，否则不更新
	if(!ball2.isOnTheBar){
		//获取小球当前位置
		var curX = ball2.x;
		var curY = ball2.y;
		//判断是否出界
		if(ball2.x >= 1360 || 
			ball2.x + 2 * ball2.radius <= -10 || 
			ball2.y >= 663 || 
			ball2.y + 2 * ball2.radius <= -10){
			totalBall = totalBall - 1;
		    if (totalBall == 0)
		    {
		    	isGameOver = true;
		    	cxt.clearRect(curX, curY, 2 * ball2.radius, 2 * ball2.radius);
		    	GameOver();
		    }
			return;
		}
		//判断是否发生碰撞
		var judgeCrashBlock;
		if(!barCollisionDetect_Ball2(ball2)){
			var deltaX = ball2.speed * Math.sin(ball2.angle * Math.PI / 180);
			var deltaY = -ball2.speed * Math.cos(ball2.angle * Math.PI / 180);
			ball2.x += deltaX;
			ball2.y += deltaY;
			judgeCrashBlock = crashBlock(ball2, ball2.x, ball2.y, deltaX, deltaY);
		}
		else if(isGameOver){
			return;
		}
		else{
			judgeCrashBlock = crashBlock(ball2, ball2.x, ball2.y, 0, 0);
		}
		if (judgeCrashBlock != null)
		{
			map[judgeCrashBlock[1]][judgeCrashBlock[2]].visible = false;
			blockNum--;
			cxt.clearRect(judgeCrashBlock[2] * 50, judgeCrashBlock[1] * 23, 50, 23);
			if (ball2.needToChangeAngle) ball2.angle = changeBallAngle(ball2.angle,judgeCrashBlock[0]);
			ball2.x -= deltaX;
			ball2.y -= deltaY;
			addCrashMusic();
			if ((!bonusAdded) && (map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus != ''))
			{
				bonusAdded = true;
				animationID_Bonus = window.requestAnimationFrame(BonusRotate);
				bonus = new Bonus(0,map[judgeCrashBlock[1]][judgeCrashBlock[2]].bonus,
					judgeCrashBlock[2] * 50,judgeCrashBlock[1] * 23);
				if(bonus.y === 311){
					if(bonus.x < 675){
						bonus.angle = 90;
					}
					else{
						bonus.angle = 270;
					}
				}
				else if(bonus.y < 311){
					bonus.angle = Math.atan((675 - ball2.x) / (ball2.y - 311)) * 180 / Math.PI;
					bonus.angle += 180;
				}
				else if(bonus.y > 311){
					bonus.angle = Math.atan((675 - ball2.x) / (ball2.y - 311)) * 180 / Math.PI;
				}
			}
		}
		//清空画布
		cxt.clearRect(curX, curY, 2 * ball2.radius, 2 * ball2.radius);
		//判断该区域内的砖块是否需要显示并绘制
		for(var i = Math.floor(curY / 23); i < Math.ceil((curY + 2 * ball2.radius) / 23); i++){
			for(var j = Math.floor(curX / 50); j < Math.ceil((curX + 2 * ball2.radius) / 50); j++){
				if(i >= 0 && i < 27 && j >= 0 && j < 27 && map[i][j].visible){
					drawBlock(j, i);
				}
			}
		}
		if(blockNum === 0){
			isGameOver = true;
			GameOver();
			return;
		}
		//绘制小球
		drawBall(ball2);
	}
	animationID_in_Ball2 = window.requestAnimationFrame(BallTwoUpdate);
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

//Bonus掉落动画
function BonusRotate () {
	cancelAnimationFrame(animationID_in_Bonus);
	var curBonusX;
	var curBonusY;
	var deltaBonusX;
	var deltaBonusY;
	if (bonusAdded)
	{
		curBonusX = bonus.x;
		curBonusY = bonus.y;
	}
	if (bonusAdded)
	{
		if (!bonusCrashBar())
		{
			deltaBonusX = bonus.speed * Math.sin(bonus.angle * Math.PI / 180);
			deltaBonusY = -bonus.speed * Math.cos(bonus.angle * Math.PI / 180);
			bonus.x += deltaBonusX;
			bonus.y += deltaBonusY;	
		}
		else
		{
			cxt.clearRect(curBonusX, curBonusY, 24, 24);
			for(var i = Math.floor(curBonusY / 23); i < Math.ceil((curBonusY + 24) / 23); i++){
				for(var j = Math.floor(curBonusX / 50); j < Math.ceil((curBonusX + 24) / 50); j++){
					if(map[i][j].visible){
						drawBlock(j, i, map[i][j].color);
					}
				}
			}
			switch(bonus.kind)
			{
				case "speed_up":
				if (typeof ball != "undefined") ball.speed = 5;
				if (typeof ball1 != "undefined") ball1.speed = 5;
				if (typeof ball2 != "undefined") ball1.speed = 5;
				setTimeout("recoverSpeed()",5000);
				break;

				case "speed_down":
				if (typeof ball != "undefined") ball.speed = 1;
				if (typeof ball1 != "undefined") ball1.speed = 1;
				if (typeof ball2 != "undefined") ball1.speed = 1;
				setTimeout("recoverSpeed()",5000);
				break;

				case "three_balls":
				ball1 = new Ball(ball.angle - 40, ball.x - 20, ball.y, 12);
				ball1.isOnTheBar = false;
				ball2 = new Ball(ball.angle + 40, ball.x + 20, ball.y, 12);
				ball2.isOnTheBar = false;
				drawBall(ball1);
				drawBall(ball2);
				animationID_Ball1 = window.requestAnimationFrame(BallOneUpdate);
	            animationID_Ball2 = window.requestAnimationFrame(BallTwoUpdate);
				ballsAdded = true;
				totalBall = 3;
				break;

				case "iron_ball":
				if (typeof ball != "undefined") ball.needToChangeAngle = false;
				if (typeof ball1 != "undefined") ball1.needToChangeAngle = false;
				if (typeof ball2 != "undefined") ball1.needToChangeAngle = false;
				setTimeout("recoverChangeAngle()", 5000);
				break;

				case "gameover":
				isGameOver = true;
				GameOver();
				break;

				default:
				break;
			}
		}
	}
	if (bonusAdded)
		{
			cxt.clearRect(curBonusX, curBonusY, 24, 24);
			for(var i = Math.floor(curBonusY / 23); i < Math.ceil((curBonusY + 24) / 23); i++){
				for(var j = Math.floor(curBonusX / 50); j < Math.ceil((curBonusX + 24) / 50); j++){
					if(map[i][j].visible){
						drawBlock(j, i, map[i][j].color);
					}
				}
			}
		}
	if (bonusAdded)
	{
		drawBonus(bonus);
	}
	animationID_in_Bonus = window.requestAnimationFrame(BonusRotate);
}

//恢复速度
function recoverSpeed()
{
	if (typeof ball != "undefined") ball.speed = 3;
	if (typeof ball1 != "undefined") ball1.speed = 3;
	if (typeof ball2 != "undefined") ball1.speed = 3;
}

//恢复needToChangeAngle
function recoverChangeAngle()
{
	if (typeof ball != "undefined") ball.needToChangeAngle = true;
	if (typeof ball1 != "undefined") ball1.needToChangeAngle = true;
	if (typeof ball2 != "undefined") ball1.needToChangeAngle = true;
}
//播放撞砖块音效
function addCrashMusic()
{
	var music = document.getElementById("crashMusic");
	music.play();
}

//打开或关闭撞砖块音效
function removeCrashMusic()
{
	var music = document.getElementById("crashMusic");
	var buttonId = document.getElementById("removeMusic");
	if (buttonId.innerHTML == "关闭音效")
	{
		music.src = '';
		buttonId.innerHTML = "打开音效";
	}
	else
	{
		music.src = 'music/crash.wav';
		buttonId.innerHTML = "关闭音效";
	}
}

//设置Bonus
function setBonus()
{
	$.getJSON("json/level_" + curLevel + "_bonus.json", function(json){
		$.each(json,function(index,element){
			map[parseInt(element["x"])][parseInt(element["y"])].bonus = element["bonus"];
		});
	});
}
//判断bonus是否被拖条接到
function bonusCrashBar(){
	//计算小球下一时间点坐标
	var deltaX = bonus.speed * Math.sin(bonus.angle * Math.PI / 180);
	var deltaY = -bonus.speed * Math.cos(bonus.angle * Math.PI / 180);
	bonus.x += deltaX;
	bonus.y += deltaY;
	//将小球坐标转换到中心画布坐标系下并判断是否在圆内
	var bonusX_center_coord = bonus.x - 675;
	var bonusY_center_coord = bonus.y - 311;
	var bonus_angle_center_coord = 0;
	if(Math.pow(bonusX_center_coord, 2) + Math.pow(bonusY_center_coord + 12, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 1.6, 2) + Math.pow(bonusY_center_coord + 6, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 1.6, 2) + Math.pow(bonusY_center_coord + 18, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 6, 2) + Math.pow(bonusY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 6, 2) + Math.pow(bonusY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 12, 2) + Math.pow(bonusY_center_coord, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 12, 2) + Math.pow(bonusY_center_coord + 24, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 18, 2) + Math.pow(bonusY_center_coord + 1.6, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 18, 2) + Math.pow(bonusY_center_coord + 22.4, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 22.4, 2) + Math.pow(bonusY_center_coord + 6, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 22.4, 2) + Math.pow(bonusY_center_coord + 18, 2) <= Math.pow(99, 2) || 
		Math.pow(bonusX_center_coord + 24, 2) + Math.pow(bonusY_center_coord + 12, 2) <= Math.pow(99, 2))
	{
		//小球预测位置在圆内，计算小球相对圆心的角度
		if(bonusY_center_coord + bonus.radius === 0){
			if(bonusX_center_coord + bonus.radius > 0){
				bonus_angle_center_coord = Math.PI / 2;
			}
			else{
				bonus_angle_center_coord = -Math.PI / 2;
			}
		}
		else{
			bonus_angle_center_coord = Math.atan((bonusX_center_coord + bonus.radius) / (-(bonusY_center_coord + bonus.radius)));
		}
		if(bonusY_center_coord + bonus.radius > 0){
			if(bonus_angle_center_coord > 0){
				bonus_angle_center_coord = bonus_angle_center_coord - Math.PI;
			}
			else{
				bonus_angle_center_coord = Math.PI + bonus_angle_center_coord;
			}
		}
		//弧度转角度
		bonus_angle_center_coord = Math.round(bonus_angle_center_coord * 180 / Math.PI);
		//判断托条是否可以挡住小球，若能挡住则发生碰撞
		var angleDiffer = bonus_angle_center_coord - bar.angle;
		if(angleDiffer < -180){
			angleDiffer += 360;
		}
		else if(angleDiffer > 180){
			angleDiffer -= 360;
		}
		if(angleDiffer <= 60 && angleDiffer >= -60){
			//托条能挡住小球，即发生碰撞
			var angle_In = Math.abs(Math.abs(bonus_angle_center_coord) + Math.abs(bonus.angle) - 180);
			if(bonus.angle < 180){
				bonus.angle = 180 + bonus.angle - 2 * angle_In;
			}
			else{
				bonus.angle = bonus.angle + 2 * angle_In - 180;
			}
			bonus.x -= 15 * deltaX;
			bonus.y -= 15 * deltaY;
			bonusAdded = false;
			return true;
		}
		else if(Math.pow(bonusX_center_coord, 2) + Math.pow(bonusY_center_coord + 12, 2) <= Math.pow(71, 2) && 
				Math.pow(bonusX_center_coord + 12, 2) + Math.pow(bonusY_center_coord, 2) <= Math.pow(71, 2) && 
				Math.pow(bonusX_center_coord + 12, 2) + Math.pow(bonusY_center_coord + 24, 2) <= Math.pow(71, 2) && 
				Math.pow(bonusX_center_coord + 24, 2) + Math.pow(bonusY_center_coord + 12, 2) <= Math.pow(71, 2))
		{
			//小球完全进入中心，游戏结束
			cxt.clearRect(bonus.x, bonus.y, 24, 24);
			bonusAdded = false;
			bonus = undefined;
			return false;
		}
	}
	else{
		//小球预测位置不在圆内，不会与托条发生碰撞
		return false;
	}
}