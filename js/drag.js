function mouseDown(evt) {
    evt.clientX >= div[0].offsetLeft && evt.clientX <= div[0].offsetLeft + div[0].offsetWidth && evt.clientY >= div[0].offsetTop && evt.clientY <= div[0].offsetTop + div[0].offsetHeight && !document.getElementById("drag").checked && (objX = div[0].style.left, 
    objY = div[0].style.top, mouseX = evt.clientX, mouseY = evt.clientY, isDown = !0);
}

function mouseMove(evt) {
    if (isDown) {
        var x = evt.clientX, y = evt.clientY;
        div[0].style.left = parseInt(objX) + parseInt(x) - parseInt(mouseX) + "px", div[0].style.top = parseInt(objY) + parseInt(y) - parseInt(mouseY) + "px";
    }
}

function mouseUp(evt) {
    if (isDown) {
        var x = evt.clientX, y = evt.clientY;
        div[0].style.left = parseInt(x) - parseInt(mouseX) + parseInt(objX) + "px", div[0].style.top = parseInt(y) - parseInt(mouseY) + parseInt(objY) + "px", 
        mouseX = x, mouseY = y, isDown = !1;
    }
}

var mouseX, mouseY, objX, objY, isDown = !1, div = document.getElementsByClassName("Modal");

document.body.onmousedown = mouseDown, document.body.onmousemove = mouseMove, document.body.onmouseup = mouseUp;