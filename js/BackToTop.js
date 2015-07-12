function ClickLU(evt) {
    var lu = document.getElementById("lu"), ld = document.getElementById("ld"), ru = document.getElementById("ru"), rd = document.getElementById("rd");
    ld.checked = !1, ru.checked = !1, rd.checked = !1, lu.checked ? (document.getElementById("x").disabled = !0, 
    document.getElementById("y").disabled = !0) : (document.getElementById("x").disabled = !1, 
    document.getElementById("y").disabled = !1);
}

function ClickLD(evt) {
    var lu = document.getElementById("lu"), ld = document.getElementById("ld"), ru = document.getElementById("ru"), rd = document.getElementById("rd");
    lu.checked = !1, ru.checked = !1, rd.checked = !1, ld.checked ? (document.getElementById("x").disabled = !0, 
    document.getElementById("y").disabled = !0) : (document.getElementById("x").disabled = !1, 
    document.getElementById("y").disabled = !1);
}

function ClickRU(evt) {
    var lu = document.getElementById("lu"), ld = document.getElementById("ld"), ru = document.getElementById("ru"), rd = document.getElementById("rd");
    lu.checked = !1, ld.checked = !1, rd.checked = !1, ru.checked ? (document.getElementById("x").disabled = !0, 
    document.getElementById("y").disabled = !0) : (document.getElementById("x").disabled = !1, 
    document.getElementById("y").disabled = !1);
}

function ClickRD(evt) {
    var lu = document.getElementById("lu"), ld = document.getElementById("ld"), ru = document.getElementById("ru"), rd = document.getElementById("rd");
    lu.checked = !1, ld.checked = !1, ru.checked = !1, rd.checked ? (document.getElementById("x").disabled = !0, 
    document.getElementById("y").disabled = !0) : (document.getElementById("x").disabled = !1, 
    document.getElementById("y").disabled = !1);
}

function init(evt) {
    var lu = document.getElementById("lu"), ld = document.getElementById("ld"), ru = document.getElementById("ru"), rd = document.getElementById("rd");
    if (lu.checked) return document.getElementById("backToTop").style.left = "5px", 
    void (document.getElementById("backToTop").style.top = "5px");
    if (ld.checked) document.getElementById("backToTop").style.left = "5px", document.getElementById("backToTop").style.top = clientH + "px"; else if (ru.checked) document.getElementById("backToTop").style.left = clientW + "px", 
    document.getElementById("backToTop").style.top = "5px"; else if (rd.checked) document.getElementById("backToTop").style.left = clientW + "px", 
    document.getElementById("backToTop").style.top = clientH + "px"; else {
        var x = document.getElementById("x").value, y = document.getElementById("y").value, xN = parseFloat(x), yN = parseFloat(y);
        "" == x && "" == y && (document.getElementById("backToTop").style.left = clientW + "px", 
        document.getElementById("backToTop").style.top = clientH + "px"), xN > clientW || 0 > xN || yN > clientH || 0 > yN ? alert("输入位置值不在以下范围内：\n0 ≤ x ≤ " + clientW + "\n0 ≤ y ≤ " + clientH) : (document.getElementById("backToTop").style.left = x + "px", 
        document.getElementById("backToTop").style.top = y + "px");
    }
}

function scrollFunc(evt) {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    0 == scrollTop ? document.getElementById("backToTop").style.display = "none" : document.getElementById("backToTop").style.display = "inline";
}

function ClickToTop(evt) {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    0 != scrollTop && (window.scrollBy(0, -50), scrollInterval = setTimeout("ClickToTop()", 30));
}

function KeyUp(evt) {
    85 == evt.keyCode && ClickToTop();
}

function Resize() {
    clientW = document.documentElement.clientWidth - 50, clientH = document.documentElement.clientHeight - 50, 
    init();
}

(0 == document.documentElement.scrollTop || 0 == window.pageYOffset || 0 == document.documentElement.scrollTop) && (document.getElementById("backToTop").style.display = "none");

var clientW = document.documentElement.clientWidth;

clientW -= 50, document.getElementById("backToTop").style.left = clientW + "px";

var clientH = document.documentElement.clientHeight;

clientH -= 50, document.getElementById("backToTop").style.top = clientH + "px", 
document.getElementById("lu").onclick = ClickLU, document.getElementById("ld").onclick = ClickLD, 
document.getElementById("ru").onclick = ClickRU, document.getElementById("rd").onclick = ClickRD, 
document.getElementById("setPos").onclick = init, window.onscroll = scrollFunc, 
document.getElementById("backToTop").onclick = ClickToTop, window.onkeyup = KeyUp, 
window.onresize = Resize;