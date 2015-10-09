//全局变量
var g_row = 60;
var g_column = 130;
var g_cellSize = 600 / g_row;
var g_fps = 10;
var g_density = 0.4;
var canvas = $("#myCanvas");
var isMouseDown = false;
//游戏主体类实现
function Game(row, column, cellSize){
	//类成员变量
	this.row = row;
	this.column = column;
	this.cellSize = cellSize;
	//map数组记录活细胞位置
	this.map = new Array(row + 4);
	for(var i = 0; i < row + 4; i++){
		this.map[i] = new Array(column + 4);
		for(var j = 0; j < column + 4; j++){
			this.map[i][j] = false;
		}		
	}
	//wall数组记录墙壁位置
	this.wall = new Array(row + 4);
	for(var k = 0; k < row + 4; k++){
		this.wall[k] = new Array(column + 4);
		for(var l = 0; l < column + 4; l++){
			this.wall[k][l] = false;
		}
	}
	//队列记录活细胞横纵坐标
	this.queue_row = new Array();
	this.queue_column = new Array();
	this.ctx = canvas[0].getContext("2d");
	//类成员函数
	//初始化
	this.init = function(){
		var ctx = this.ctx;
		//画背景
		ctx.fillStyle = "gray";
		ctx.fillRect(0, 0, this.column * this.cellSize, this.row * this.cellSize);
		ctx.strokeStyle = "white";
		//画网格
		for(var i = 0; i < this.column; i++){
			ctx.beginPath();
			ctx.moveTo(i * this.cellSize, 0);
			ctx.lineTo(i * this.cellSize, this.row * this.cellSize);
			ctx.stroke();
		}
		for(var j = 0; j < this.row; j++){
			ctx.beginPath();
			ctx.moveTo(0, j * this.cellSize);
			ctx.lineTo(this.column * this.cellSize, j * this.cellSize);
			ctx.stroke();
		}
		//随机生成活细胞
		for(var k = 0; k < this.column; k++){
			for(var l = 0; l < this.row; l++){
				var rand = Math.random();
				if(!this.wall[l + 2][k + 2] && rand < g_density){
					ctx.fillStyle = "pink";
					ctx.fillRect(k * this.cellSize + 0.8, l * this.cellSize + 0.8, 
								this.cellSize - 1.9, this.cellSize - 1.9);
					this.map[l + 2][k + 2] = true;
					this.queue_row.unshift(l + 2);
					this.queue_column.unshift(k + 2);
				}
			}
		}
	};
	//设置墙壁
	this.setWall = function(x, y){
		if(y >= 0 && y < this.row && x >= 0 && x < this.column){
			this.ctx.fillStyle = "yellow";
			this.ctx.fillRect(x * this.cellSize + 0.8, y * this.cellSize + 0.8, 
							this.cellSize - 1.9, this.cellSize - 1.9);
			this.wall[y + 2][x + 2] = true;
		}
	};
	//转换
	this.transit = function(){
		var flag = new Array(this.row);
		//状态将要改变的活、死细胞横纵坐标
		var queue_row_change = new Array();
		var queue_column_change = new Array();
		//状态不变的活细胞横纵坐标
		var queue_row_unchange = new Array();
		var queue_column_unchange = new Array();
		//每个细胞只检查一次，用flag数组记录
		for(var i = 0; i < this.row; i++){
			flag[i] = new Array(this.column);
			for(var j = 0; j < this.column; j++){
				flag[i][j] = false;
			}		
		}
		//对每个活细胞及其周围8连通细胞进行检查
		while(this.queue_column.length !== 0){
			var temp_row_1 = this.queue_row.pop();
			var temp_column_1 = this.queue_column.pop();
			for(i = temp_row_1 - 2; i <= temp_row_1 + 2; i++){
				if(i - 2 >= 0 && i - 2 < this.row && !this.wall[i][temp_column_1]){
					if(!flag[i - 2][temp_column_1 - 2]){
						var num_1 = this.countNum(i, temp_column_1);	//计算当前细胞周围活细胞数目
						if((this.map[i][temp_column_1] && num_1 !== 3 && num_1 !== 2) || 
							((!this.map[i][temp_column_1]) && num_1 === 3)){
							queue_row_change.unshift(i);
							queue_column_change.unshift(temp_column_1);
						}
						else if(this.map[i][temp_column_1]){
							queue_row_unchange.unshift(i);
							queue_column_unchange.unshift(temp_column_1);
						}
						flag[i - 2][temp_column_1 - 2] = true; 
					}
				}
			}
			for(i = temp_column_1 - 2; i <= temp_column_1 + 2; i++){
				if(i - 2 >= 0 && i - 2 < this.column && !this.wall[temp_row_1][i]){
					if(!flag[temp_row_1 - 2][i - 2]){
						var num_2 = this.countNum(temp_row_1, i);	//计算当前细胞周围活细胞数目
						if((this.map[temp_row_1][i] && num_2 !== 3 && num_2 !== 2) || 
							((!this.map[temp_row_1][i]) && num_2 === 3)){
							queue_row_change.unshift(temp_row_1);
							queue_column_change.unshift(i);
						}
						else if(this.map[temp_row_1][i]){
							queue_row_unchange.unshift(temp_row_1);
							queue_column_unchange.unshift(i);
						}
						flag[temp_row_1 - 2][i - 2] = true; 
					}
				}	
			}
		}
		//改变状态
		while(queue_column_change.length !== 0){
			var temp_row_2 = queue_row_change.pop();
			var temp_column_2 = queue_column_change.pop();
			this.map[temp_row_2][temp_column_2] = !this.map[temp_row_2][temp_column_2];
			if(this.map[temp_row_2][temp_column_2]){
				this.ctx.fillStyle = "pink";
				//将改变状态后的活细胞横纵坐标加入队列
				this.queue_row.unshift(temp_row_2);
				this.queue_column.unshift(temp_column_2);				
			}
			else{
				this.ctx.fillStyle = "gray";
			}
			this.ctx.fillRect((temp_column_2 - 2) * this.cellSize + 0.8, (temp_row_2 - 2) * this.cellSize + 0.8, 
							this.cellSize - 1.9, this.cellSize - 1.9);
		}
		//将不变的活细胞横纵坐标加入队列
		while(queue_column_unchange.length !== 0){
			this.queue_row.unshift(queue_row_unchange.pop());
			this.queue_column.unshift(queue_column_unchange.pop());
		}
	};
	//计算(r, c)处细胞周围的活细胞数目
	this.countNum = function(r, c){
		var num = 0;
		for(var i = r - 2; i <= r + 2; i++){
			if(!this.wall[i][c] && i !== r && this.map[i][c]){
				num++;
			}
		}
		for(var j = c - 2; j <= c + 2; j++){
			if(!this.wall[r][j] && j !== c && this.map[r][j]){
				num++;
			}
		}
		return num;
	};
	//清除画布
	this.remove = function(){
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, 1300, 600);
	};
}
//初始化
var game = new Game(5, 5, 50);
for(var i = 0; i < 5; i++){
	for(var j = 0; j < 5; j++){
		game.map[i + 2][j + 2] = false;
	}
}
var game = new Game(g_row, g_column, g_cellSize);
game.init();
//不断刷新
function refresh(){
	game.transit();
}
var fId = setInterval(refresh, 1000 / g_fps);
//鼠标点击设置墙壁
canvas.mousedown(function(evt){
	isMouseDown = true;
	var x = Math.floor(evt.pageX / game.cellSize);
	var y = Math.floor(evt.pageY / game.cellSize);
	game.setWall(x, y);
});
$(window).mouseup(function(evt){
	isMouseDown = false;
});
canvas.mousemove(function(evt){
	if(isMouseDown){
		var x = Math.floor(evt.pageX / game.cellSize);
		var y = Math.floor(evt.pageY / game.cellSize);
		game.setWall(x, y);
	}
});
//响应用户交互（点击刷新按钮）事件
$("#refresh").click(function(){
	var r = $("#row").val();
	var c = $("#column").val();
	var f = $("#fps").val();
	var d = $("#density").val();
	if(r < 10 || r > 60 || c < 10 || c > 130 || f < 0.5 || f > 20 || d < 0 || d > 1){
		alert("输入超出范围！");
		return;
	}
	g_row = r;
	g_column = c;
	g_fps = f;
	g_density = d;
	g_cellSize = Math.min(Math.floor(600 / g_row), Math.floor(1300 / g_column));
	game.remove();
	game = new Game(g_row, g_column, g_cellSize);
	game.init();
	fId = window.clearInterval(fId);
	fId = setInterval(refresh, 1000 / g_fps);
});