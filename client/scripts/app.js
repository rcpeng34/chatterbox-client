// Use our own templating engine
// Have on clicks in one place

var app = {
  init: function() {
    var that = this;
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    this.currentMessages;
    this.roomname;
    this.person;
    this.friendslist = ['All Users'];

    // Main fetch logic
    setInterval(function() {
      that.fetch(that.roomname, that.person);
      that.getRoomName();
    }, 5000);

    // Send logic
    $("#enter").on('click', function() {
      var message = {
        'username': window.location.search.split('=')[1],
        'text': $('textarea').val(),
        'roomname': app.roomname
      };
      app.send(message);
    });

    this.getRoomName();
    this.buildFriendbar();
  },

  // get request data: searchQuery. post data: message.
  request: function(type, data, callback) {
    $.ajax({
      url: app.server,
      type: type,
      data: data,
      contentType: 'application/json',
      success: function (response) {
        if (callback) {
          callback(response);
        }
      }
    });
  },

  send: function(message) {
    app.request('POST', JSON.stringify(message));
  },

  fetch: function(room, person) {
    var searchData = {
      order: '-createdAt',
      where: {}
    };
    if (room) {
      searchData.where.roomname = app.roomname;
    }
    if (person) {
      searchData.where.username = app.person;
    }
    app.request('GET', searchData, function(response) {
      app.display(response.results);
    });
  },
  getRoomName: function() {
    var that = this;
    var data = {
      keys: 'roomname',
      order: '-createdAt'
    };
    app.request('GET', data, function(response) {
      var rooms = {};
      for(var i = 0; i < response.results.length; i++) {
        rooms[response.results[i].roomname] = true;
      }
      that.buildSidebar(Object.keys(rooms));
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
      app.person = null;
      app.fetch(app.roomname, null);
    });
    $('#makeRoom').on('click', function() {
      //create a new room
      app.roomname = $('#newRoomName').val();
      app.fetch(app.roomname, null);
    });
  },

  buildFriendbar: function() {
    // if you click on add friend, then you add friend and append it to the dom
    $('#addFriend').on('click', function() {
      // escape the text value
      var newFriend = $('<div class = friendname></div>').text($('#newFriendName').val());
      // add friend to the friendbar
      $('#friendbar').append(newFriend);
      $('.friendname').on('click', function(){
        app.person = $(this).text();
        app.roomname = null;
        app.fetch(null, app.person);
      });
    });
  }
};

app.init();
