var mouseX, mouseY;  
var objX, objY;  
var isDown = false;  //是否按下鼠标 
var div = document.getElementsByClassName('Modal');

function mouseDown(evt){
    if(evt.clientX >= div[0].offsetLeft && evt.clientX <= div[0].offsetLeft + div[0].offsetWidth
        && evt.clientY >= div[0].offsetTop && evt.clientY <= div[0].offsetTop + div[0].offsetHeight
        && !document.getElementById('drag').checked){
        objX = div[0].style.left;  
        objY = div[0].style.top;  
        mouseX = evt.clientX;  
        mouseY = evt.clientY;  
        isDown = true;
    }
};
function mouseMove(evt){
    if (isDown){
        var x = evt.clientX;
        var y = evt.clientY;
        div[0].style.left = parseInt(objX) + parseInt(x) - parseInt(mouseX) + "px";  
        div[0].style.top = parseInt(objY) + parseInt(y) - parseInt(mouseY) + "px";  
    } 
};
function mouseUp(evt){
    if (isDown){  
        var x = evt.clientX;  
        var y = evt.clientY; 
        div[0].style.left = (parseInt(x) - parseInt(mouseX) + parseInt(objX)) + "px";  
        div[0].style.top = (parseInt(y) - parseInt(mouseY) + parseInt(objY)) + "px"; 
        mouseX = x;  
        mouseY = y; 
        isDown = false;  
    }
};
document.body.onmousedown = mouseDown;
document.body.onmousemove = mouseMove;
document.body.onmouseup = mouseUp;