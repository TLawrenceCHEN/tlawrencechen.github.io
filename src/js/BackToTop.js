//设置初始按钮是否显示
if(document.body.scrollTop == 0){
	document.getElementById('backToTop').style.display = 'none';
}
//设置回到顶部按钮的默认位置
var clientW = document.body.clientWidth;
clientW -= 50;
document.getElementById('backToTop').style.left = clientW + 'px';
var clientH = window.screen.availHeight;
clientH -= 150;
document.getElementById('backToTop').style.top = clientH + 'px';
//当复选框选中时不允许在文本框输入，同时保证复选框只能选中一个
function ClickLU(evt){
	var lu = document.getElementById('lu');
	var ld = document.getElementById('ld');
	var ru = document.getElementById('ru');
	var rd = document.getElementById('rd');
	ld.checked = false;
	ru.checked = false;
	rd.checked = false;
	if(lu.checked){
		document.getElementById('x').disabled = true;
		document.getElementById('y').disabled = true;
	}
	else{
		document.getElementById('x').disabled = false;
		document.getElementById('y').disabled = false;
	}
}
function ClickLD(evt){
	var lu = document.getElementById('lu');
	var ld = document.getElementById('ld');
	var ru = document.getElementById('ru');
	var rd = document.getElementById('rd');
	lu.checked = false;
	ru.checked = false;
	rd.checked = false;
	if(ld.checked){
		document.getElementById('x').disabled = true;
		document.getElementById('y').disabled = true;
	}
	else{
		document.getElementById('x').disabled = false;
		document.getElementById('y').disabled = false;
	}
}
function ClickRU(evt){
	var lu = document.getElementById('lu');
	var ld = document.getElementById('ld');
	var ru = document.getElementById('ru');
	var rd = document.getElementById('rd');
	lu.checked = false;
	ld.checked = false;
	rd.checked = false;
	if(ru.checked){
		document.getElementById('x').disabled = true;
		document.getElementById('y').disabled = true;
	}
	else{
		document.getElementById('x').disabled = false;
		document.getElementById('y').disabled = false;
	}
}
function ClickRD(evt){
	var lu = document.getElementById('lu');
	var ld = document.getElementById('ld');
	var ru = document.getElementById('ru');
	var rd = document.getElementById('rd');
	lu.checked = false;
	ld.checked = false;
	ru.checked = false;
	if(rd.checked){
		document.getElementById('x').disabled = true;
		document.getElementById('y').disabled = true;
	}
	else{
		document.getElementById('x').disabled = false;
		document.getElementById('y').disabled = false;
	}
}
document.getElementById('lu').onclick = ClickLU;
document.getElementById('ld').onclick = ClickLD;
document.getElementById('ru').onclick = ClickRU;
document.getElementById('rd').onclick = ClickRD;
//设定按钮位置
function init(evt){
	var lu = document.getElementById('lu');
	var ld = document.getElementById('ld');
	var ru = document.getElementById('ru');
	var rd = document.getElementById('rd');
	if(lu.checked){
		document.getElementById('backToTop').style.left = '18px';
		document.getElementById('backToTop').style.top = '5px';
		return;
	}
	else if(ld.checked){
		document.getElementById('backToTop').style.left = '18px';
		document.getElementById('backToTop').style.top = clientH + 'px';
	}
	else if(ru.checked){
		document.getElementById('backToTop').style.left = clientW + 'px';
		document.getElementById('backToTop').style.top = '5px';
	}
	else if(rd.checked){
		document.getElementById('backToTop').style.left = clientW + 'px';
		document.getElementById('backToTop').style.top = clientH + 'px';
	}
	else{
		var x = document.getElementById('x').value;
		var y = document.getElementById('y').value;
		var xN = parseFloat(x);
		var yN = parseFloat(y);
		if(xN > clientW || xN < 0 || yN > clientH || yN < 0 || x == ("") || y == ("")){
			alert("输入位置值不在以下范围内：\n0 ≤ x ≤ " + clientW + "\n0 ≤ y ≤ " + clientH);
		}
		else{
			document.getElementById('backToTop').style.left = x + 'px';
			document.getElementById('backToTop').style.top = y + 'px';
		}
	}
}
document.getElementById('setPos').onclick = init;
//设置滚动条事件来隐藏按钮
function scrollFunc(evt){
	if(document.body.scrollTop == 0){
		document.getElementById('backToTop').style.display = 'none';
	}
	else{
		document.getElementById('backToTop').style.display = 'inline';
	}
}
document.onscroll = scrollFunc;
//设置按钮点击事件来回到顶部
function ClickToTop(evt){
	if(document.body.scrollTop != 0){
		window.scrollBy(0, -50);
		scrollInterval = setTimeout('ClickToTop()', 30);
	}
}
document.getElementById('backToTop').onclick = ClickToTop;
//设置键盘快捷键'U'响应事件
function KeyUp(evt){
	if(evt.keyCode == 85){
		ClickToTop();
	}
}
window.onkeyup = KeyUp;
