var closeKey;
//设置弹窗按钮响应点击事件
function PopOut(evt){
	var content = document.getElementById('content').value;
	closeKey = document.getElementById('closeKey').value;
	var modal = document.createElement('div');
	var background = document.createElement('div');
	var cover = document.createElement('div');
	var modaltitle = document.createElement('div');
	var modalcontent = document.createElement('p');
	var modalbtn = document.createElement('p');
	var str = "<button onclick = 'Remove();'>确定</button>";
	var script = document.createElement('script');
	modal.className = 'Modal';
	modal.style.left = document.documentElement.clientWidth / 2 - 150 + 'px';
	modal.style.right = document.documentElement.clientWidth / 2 + 150 + 'px';
	modal.style.top = document.documentElement.clientHeight / 2 - 50 + 'px';
	modal.style.bottom = document.documentElement.clientHeight / 2 + 50 + 'px';
	background.className = 'BG';
	cover.className = 'Cover';
	modaltitle.className = 'Title';
	modaltitle.innerHTML = '弹窗';
	modalcontent.className = 'Content';
	modalbtn.className = 'Content';
	modalcontent.innerHTML = content || '这是一个弹窗';
	modalcontent.style.margin = '20px';
	modalbtn.innerHTML = str;
	script.type = 'text/javascript';
	script.src = 'js/drag.js';
	modal.appendChild(modaltitle);
	modal.appendChild(modalcontent);
	modal.appendChild(modalbtn);
	cover.appendChild(modal);
	cover.appendChild(background);
	cover.appendChild(script);
	document.body.appendChild(cover);
	if(!document.getElementById('drag').checked){
		modal.style.cursor = 'move';
	}
}
document.getElementById('popOut').onclick = PopOut;
//设置键盘快捷键响应事件
function KeyUp(evt){
	if(closeKey){
		if(evt.keyCode == closeKey){
			Remove();
		}
	}
	else{
		if(evt.keyCode == 27){
			Remove();
		}
	}
}
window.onkeyup = KeyUp;
//设置去除弹窗事件
function Remove(evt){
	var node = document.getElementsByClassName('Cover');
	document.body.removeChild(node[0]);
	document.body.removeChild()
	return;
}