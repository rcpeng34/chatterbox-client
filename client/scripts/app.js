var app = {
  init: function() {
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    var that = this;
    this.currentMessages;
    this.roomname;
    setInterval(function() {
      that.fetch(that.roomname);
      that.getRoomName();
    }, 5000);

    $("#enter").on('click', function() {
      //send the message
      var message = {
        'username': window.location.search.split('=')[1],
        'text': $('textarea').val(),
        'roomname': app.roomname
      };
      console.log('calling send', message);
      app.send(message);
    });

    this.getRoomName();
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
  fetch: function(room) {
    var searchData;
    if (room === undefined) {
      searchData = {order: '-createdAt'};
    } else {
      searchData = {
        order: '-createdAt',
        where: {roomname: room}
      };
    }
    $.ajax({
      // always use this url
      type: 'GET',
      url: app.server,
      data: searchData,
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
        keys: 'roomname',
        order: '-createdAt'
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
    $('#sidebar > *').remove();
    $('#sidebar').append('<div class = allRooms>All</div');
    $('.allRooms').on('click', function() {
      app.roomname = undefined;
    });
    for (var i = 0; i < rooms.length; i++) {
      var roomNode = $('<div class = roomname></div>').text(rooms[i]);
      $('#sidebar').append(roomNode);
    }
    $('.roomname').on('click', function() {
      //update roomname variable
      app.roomname = $(this).text();
    });
    $('#makeRoom').on('click', function() {
      //create a new room
      app.roomname = $('#newRoomName').val();
    });
  }
};

app.init();
