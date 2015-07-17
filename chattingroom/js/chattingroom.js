//Get the database reference
var refDB = new Firebase('https://chattingroom.firebaseio.com/');
//Get the width and the height of the window
var winW = $(window).width();
var winH = $(window).height();
//Get the width and the height of the document
var docW = $(document).width();
var docH = $(document).height();
//Set this user's name
var thisUserName = null;
//Set the return key of newly pushed data to check out if it's legal
var newKey;
//Set the list of current list of users' names
var listFromDB;
//Set the flag to judge whether the new name is conflict
var conflictFlag = false;
//Set initial pop out for user name input
var popout_window = $('<div/>');
var popout_cover = $('<div/>');
popout_window.css({
	'position': 'fixed',
	'background-color': 'white',
	'border': '3px solid lightblue',
	'border-radius': '10px',
	'padding': '5px',
	'left': winW / 2 - 142 + 'px',
	'right': winW / 2 - 142 + 'px',
	'top': winH / 2 - 50 + 'px',
	'bottom': winH / 2 - 50 + 'px',
	'z-index': '2'
});
popout_window.append('<p>请输入您的用户名：</p>').
			append('<input id="userName" type="text" placeholder="用户名" autofocus="autofocus" maxlength="10"/>').
			append('<button id="setName">确定</button>');
popout_cover.css({
	'background-color': 'gray',
	'opacity': '0.5',
	'top': '0px',
	'left': '0px',
	'position': 'fixed',
	'width': docW,
	'height': docH,
	'z-index': '1'
});
$('body').append(popout_cover).append(popout_window);
//Write the user's name into the database when user click the setName button
function setUserName(){
	if($('#userName').val() === ''){
		alert("用户名不能为空！请重新输入。");
	}
	else{
		thisUserName = $('#userName').val();
		var nameRef = refDB.child("userName");
		newKey = nameRef.push(thisUserName);
		for(var attr in listFromDB){
			if(attr != newKey.path.n[1] && listFromDB[attr] === thisUserName){
				conflictFlag = true;
				break;
			}
		}
		if(conflictFlag){
			nameRef.child(newKey.path.n[1]).remove();
			alert("该用户已存在，请重新输入！");
			$('#userName').val('');
			conflictFlag = false;
			return;
		}
		else{
			var inlineSpan = $('<span/>');
			inlineSpan.text(thisUserName);
			$('#userList').append(inlineSpan);
			var curText = $('#curUser').text();
			$('#curUser').text(curText + thisUserName); 
		}
		popout_cover.remove();
		popout_window.remove();
	}
}
$('#setName').click(setUserName);
//Judge if the user name already exists
refDB.child("userName").on('value', function(snapshot){
	listFromDB = snapshot.val();
});
//If there is a new user coming in, show his/her name on the left list
refDB.child("userName").on('child_added', function(snapshot){
	var newComer = snapshot.val();
	if(newComer != thisUserName){
		var inlineSpan = $('<span class="names"/>');
		inlineSpan.text(newComer);
		$('#userList').append(inlineSpan);
	}
});
//If the user click the send button, show the message on the screen
refDB.child('chatContent').on('child_added', function(snapshot){
	var newContent = snapshot.val();
	var newName = newContent.userName;
	var newText = newContent.text;
	var newMessageElement = $("<span class='messages'/>");
    var nameElement = $("<strong style='color: lightblue'/>");
    nameElement.text(newName + ': ');
    newMessageElement.text(newText).prepend(nameElement).appendTo($('#chattingMain'));
    //Set the scroll position
    document.getElementById('chattingMain').scrollTop = document.getElementById('chattingMain').scrollHeight;
});
function sendMessage(){
	if($('#text').val() === ''){
		alert("发送内容不能为空！");
	}
	else{
		refDB.child('chatContent').push({userName: thisUserName, text: $('#text').val()});
		$('#text').val('');
	}
}
$('#send').click(sendMessage);
//If a user quits the room, remove his/her name out of the list
refDB.child("userName").on('child_removed', function(oldChildSnapshot){
	if(!conflictFlag){	//Judge if it's a conflict remove
		var oldName = oldChildSnapshot.val();
		var nameSpan = $('.names');
		for(var i = 0; i < nameSpan.length; i++){
			if(nameSpan.eq(i).text() === oldName){
				nameSpan.eq(i).remove();
				break;
			}
		}
	}
});
//Listen to the keypress event for shortcut key
$('#userName').keyup(function(event){
	if(event.keyCode === 13){
		setUserName();
	}
});
$('#text').keyup(function(){
	if(event.keyCode === 13){
		sendMessage();
	}
});
//Listen to the close window event or refresh window event for data change
$(window).unload(function(){
	var nameRef = refDB.child("userName");
	if(newKey){
		nameRef.child(newKey.path.n[1]).remove();
	}
});
//Handling the disconnect event
Firebase.goOnline();