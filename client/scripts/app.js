$(document).ready(function(){


  app = {};

  var fetch = function(callback){

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=10',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log(data);
        callback(data);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  };

  var post = function(message){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function () {
        // callback(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  var retrieveMessages = function(data){
    $('.messageList').find('li').remove();
    $('.roomList').find('li').remove();

    var rooms = [];
    var allMessages = data.results;

    _.each(allMessages, function(messageObject){

      if (messageObject.username){
        var name = messageObject.username.replace(/<.+>/g,'')
      } else {
        var name = 'No Name Provided';
      }
      if (messageObject.text){
        var textToSend = messageObject.text.replace(/<.+>/g,'')
      } else if (messageObject.userMessage){
        var textToSend = messageObject.userMessage.replace(/<.+>/g,'')
      } else {
        var textToSend = 'No Message Provided';
      }
      if (messageObject.roomName){
        var chatroom = messageObject.roomName.replace(/<.+>/g,'')
      } else if (messageObject.roomname){
        var chatroom = messageObject.roomname.replace(/<.+>/g,'')
      } else {
        var chatroom = 'No Chatroom Provided';
      }
      rooms.push(chatroom);

      var messageElement = '<a href="#">'+name+'</a>: '+textToSend+'</br>';

      // if(type === 'rooms') {

      // }

      $('.messageList').append('<li>'+messageElement+'</li>');
    });

    var uniqRooms = _.uniq(rooms);
    _.each(uniqRooms,function(elem){
      $('.roomList').append('<li><a href="#">'+elem+'</a></li>');
    });
  }

  $('.button').on('click',function(event){
    var messageText = $('.messageInput').val();
    var messageRoom = $('.roomInput').val();
    var userName = window.location.search.replace(/\?username=/g, '');
    var message = {
      username: userName,
      text: messageText,
      roomname: messageRoom,
    };
    post(message);
  });

  $('ul.roomList').on('click','a',function(event){

    // fetch(retrieveMessages($(this).html(), rooms));
    console.log( $(this).html() );
  });

  $('ul.messageList').on('click','a',function(event){
    // event.preventDefault();
    console.log( $(this).html() );
  });

  fetch(retrieveMessages);
  setInterval (function(){fetch(retrieveMessages)},2000);

});
