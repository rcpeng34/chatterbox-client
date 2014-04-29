var app = {
  init: function() {
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    var that = this;
    this.currentMessages;
    setInterval(function() {
      that.fetch();
    }, 5000);

    $("#enter").on('click', function() {
      //send the message
      var message = {
        'username': window.location.search.split('=')[1],
        'text': $('textarea').val(),
        'roomname': 'NewZealand'
      };
      console.log('calling send');
      app.send(message);
    });

    this.getRoomName();

    $("#roomname").on('click', function() {
      //filter messages by room
    });
  },

  send: function(message) {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function() {
    $.ajax({
      // always use this url
      type: 'GET',
      url: app.server,
      data: {
        order: '-createdAt',
        where: {roomname: '4chan'}
      },
      contentType: 'application/json',
      success: function (data) {
        app.display(data.results);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },
  display: function(msgArray) {
    $('.chat').remove();
    for (var i = 0; i < msgArray.length; i++) {
      var message = msgArray[i];
      var username = message.username;
      var text = message.text;
      var $messageNode = $('<div class = "chat" data-message-id = "' + message.objectId + '"></div>');
      var $usernameNode = $('<div class = "username"></div>');
      $usernameNode.text(username + ' in chatroom: ' + message.roomname);
      var $textNode = $('<div class = "text"></div>');
      $textNode.text(text + " @: " + message.createdAt);
      $messageNode.append($usernameNode);
      $messageNode.append($textNode);
      $('#messages').append($messageNode);
      if ($('.chat').length > 100) {
        $('.chat:last-child').remove();
      }
    }
  },
  getRoomName: function() {
    var rooms = {};
    var that = this;
    $.ajax({
      type: 'GET',
      url: app.server,
      data: {
        keys: 'roomname'
      },
      contentType: 'application/json',
      success: function(data) {
        for(var i = 0; i < data.results.length; i++) {
          rooms[data.results[i].roomname] = true;
        }
        that.buildSidebar(Object.keys(rooms));
      }
    });
  },
  buildSidebar: function(rooms) {
    for (var i = 0; i < rooms.length; i++) {
      $('#sidebar').append('<div id = roomname>' + rooms[i] + '</div>');
    }
  }
};

app.init();
