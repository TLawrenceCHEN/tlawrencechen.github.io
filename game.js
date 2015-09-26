var clientWidth = $(window).width();
var clientHeight = $(window).height();
function Game(row, column, cellSize){
	//类成员变量
	this.row = row;
	this.column = column;
	this.cellSize = cellSize;
	//map数组记录活细胞位置
	this.map = new Array(row + 2);
	for(var i = 0; i < row + 2; i++){
		this.map[i] = new Array(column + 2);
		for(var j = 0; j < column + 2; j++){
			this.map[i][j] = false;
		}		
	}
	//队列记录活细胞横纵坐标
	this.queue_row = new Array();
	this.queue_column = new Array();
	var canvas = $("#myCanvas");
	this.ctx = canvas[0].getContext("2d");
	//类成员函数
	//初始化
	this.init = function(){
		var ctx = this.ctx;
		//画背景
		ctx.fillStyle = "gray";
		ctx.fillRect(0, 0, clientWidth, clientHeight);
		ctx.strokeStyle = "white";
		//画网格
		for(var i = 0; i < this.column; i++){
			ctx.beginPath();
			ctx.moveTo(i * this.cellSize, 0);
			ctx.lineTo(i * this.cellSize, clientHeight);
			ctx.stroke();
		}
		for(var j = 0; j < this.row; j++){
			ctx.beginPath();
			ctx.moveTo(0, j * this.cellSize);
			ctx.lineTo(clientWidth, j * this.cellSize);
			ctx.stroke();
		}
		//随机生成活细胞
		for(var k = 0; k < this.column - 1; k++)
			for(var l = 0; l < this.row - 1; l++){
				var rand = Math.random();
				if(rand < 0.4){
					ctx.fillStyle = "pink";
					ctx.fillRect(k * this.cellSize + 0.9, l * this.cellSize + 0.9, this.cellSize - 1.8, 
						this.cellSize - 1.8);
					this.map[l + 1][k + 1] = true;
					this.queue_row.unshift(l + 1);
					this.queue_column.unshift(k + 1);
				}
			}
	};
	//转换
	this.transition = function(){
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
		//对每个活细胞及其周围8个细胞进行检查
		while(this.queue_column.length != 0){
			var temp_row = this.queue_row.pop();
			var temp_column = this.queue_column.pop();
			for(var i = temp_row - 1; i <= temp_row + 1; i++){
				for(var j = temp_column - 1; j <= temp_column + 1; j++){
					if(i - 1 >= 0 && i - 1 < this.row && j - 1 >= 0 && j - 1 < this.column){
						if(!flag[i - 1][j - 1]){
							var num = this.countNum(i, j);	//计算当前细胞周围活细胞数目
							if((this.map[i][j] && num != 3 && num != 2) 
								|| ((!this.map[i][j]) && num == 3)){
								queue_row_change.unshift(i);
								queue_column_change.unshift(j);
							}
							else if(this.map[i][j]){
								queue_row_unchange.unshift(i);
								queue_column_unchange.unshift(j);
							}
							flag[i - 1][j - 1] = true; 
						}
					}
				}
			}
		}
		//改变状态
		while(queue_column_change.length != 0){
			var temp_row = queue_row_change.pop();
			var temp_column = queue_column_change.pop();
			this.map[temp_row][temp_column] = !this.map[temp_row][temp_column];
			if(this.map[temp_row][temp_column]){
				this.ctx.fillStyle = "pink";
				//将改变状态后的活细胞横纵坐标加入队列
				this.queue_row.unshift(temp_row);
				this.queue_column.unshift(temp_column);				
			}
			else{
				this.ctx.fillStyle = "gray";
			}
			this.ctx.fillRect((temp_column - 1) * this.cellSize + 0.9, (temp_row - 1) * this.cellSize + 0.9, this.cellSize - 1.8, this.cellSize - 1.8);
		}
		//将不变的活细胞横纵坐标加入队列
		while(queue_column_unchange.length != 0){
			this.queue_row.unshift(queue_row_unchange.pop());
			this.queue_column.unshift(queue_column_unchange.pop());
		}
	};
	//计算(r, c)处细胞周围的活细胞数目
	this.countNum = function(r, c){
		var num = 0;
		for(var i = r - 1; i <= r + 1; i++)
			for(var j = c - 1; j <= c + 1; j++){
				if((!(i == r && j == c)) && this.map[i][j])
				{
					num++;
				}
			}
		return num;
	};
}
//初始化
var cellSize = parseInt(clientHeight / 60);
var column = parseInt(clientWidth / cellSize);
var game = new Game(60, column, cellSize);
game.init();
//不断刷新
function refresh(){
	game.transition();
}
setInterval(refresh, 100);
//Enter键可重置
$(window).keyup(function(event){
	if(event.keyCode == 13){
		game.init();
	}
});