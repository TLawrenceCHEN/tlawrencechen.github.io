function PopOut(evt) {
    var content = document.getElementById("content").value;
    closeKey = document.getElementById("closeKey").value;
    var modal = document.createElement("div"), background = document.createElement("div"), cover = document.createElement("div"), modaltitle = document.createElement("div"), modalcontent = document.createElement("p"), modalbtn = document.createElement("p"), str = "<button onclick = 'Remove();'>确定</button>", script = document.createElement("script");
    modal.className = "Modal", modal.style.left = document.documentElement.clientWidth / 2 - 150 + "px", 
    modal.style.right = document.documentElement.clientWidth / 2 + 150 + "px", modal.style.top = document.documentElement.clientHeight / 2 - 50 + "px", 
    modal.style.bottom = document.documentElement.clientHeight / 2 + 50 + "px", background.className = "BG", 
    cover.className = "Cover", modaltitle.className = "Title", modaltitle.innerHTML = "弹窗", 
    modalcontent.className = "Content", modalbtn.className = "Content", modalcontent.innerHTML = content || "这是一个弹窗", 
    modalcontent.style.margin = "20px", modalbtn.innerHTML = str, script.type = "text/javascript", 
    script.src = "js/drag.js", modal.appendChild(modaltitle), modal.appendChild(modalcontent), 
    modal.appendChild(modalbtn), cover.appendChild(modal), cover.appendChild(background), 
    cover.appendChild(script), document.body.appendChild(cover), document.getElementById("drag").checked || (modal.style.cursor = "move");
}

function KeyUp(evt) {
    closeKey ? evt.keyCode == closeKey && Remove() : 27 == evt.keyCode && Remove();
}

function Remove(evt) {
    var node = document.getElementsByClassName("Cover");
    document.body.removeChild(node[0]), document.body.removeChild();
}

var closeKey;

document.getElementById("popOut").onclick = PopOut, window.onkeyup = KeyUp;