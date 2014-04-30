// Use our own templating engine
// Have on clicks in one place

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  currentMessages: '',
  roomname: null,
  person: null,
  friendslist: ['All Users'],
  init: function() {
    var that = this;

    this.fetch();
    // Main fetch logic
    // setInterval(function() {
    //   that.fetch(that.roomname, that.person);
    //   that.getRoomName();
    // }, 5000);

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
      },
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
      searchData.where.roomname = app.roomname.trim();
    }
    if (person) {
      searchData.where.username = app.person.trim();
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

      var data = {
        username: message.username,
        description: message.text,
        moment: moment(message.createdAt).startOf('hour').fromNow()
      };

      var html = engine.render('messageTemplate', data);
      $('#messages').append(html);
      if ($('.chat').length > 100) {
        $('.chat:last-child').remove();
      }
    }
  },
  buildSidebar: function(rooms) {
    $('#sidebar > *').remove();
    $('#sidebar').append('<div class = "allRoom highlighted">All Rooms</div');
    $('.allRooms').on('click', function() {
      app.highlight($(this));
      app.roomname = undefined;
    });

    for (var i = 0; i < rooms.length; i++) {
      var newRoom = engine.render('roomTemplate', { roomname: rooms[i]});
      $('#sidebar').append(newRoom);
    }
    $('.roomname').on('click', function() {
      //update roomname variable
      app.roomname = $(this).text();
      app.person = null;
      app.fetch(app.roomname, null);
      app.highlight($(this));
    });
    $('#makeRoom').on('click', function() {
      //create a new room
      app.roomname = $('#newRoomName').val();
      app.fetch(app.roomname, null);
    });
  },

  highlight: function($element) {
    $('.highlighted').removeClass('highlighted');
    $element.addClass('highlighted');
  },

  buildFriendbar: function() {
    // set all users on click to search for no specific person
    $('.allusers').on('click', function() { app.highlight($(this)); app.roomname = null; });
    // if you click on add friend, then you add friend and append it to the dom
    $('#addFriend').on('click', function() {
      // escape the text value
      var data = { friendname: $('#newFriendName').val() };
      var newFriend = engine.render('friendTemplate', data);
      $('#friendbar').append(newFriend);
      $('.friendname').on('click', function(){
        app.person = $(this).text();
        app.roomname = null;
        app.fetch(null, app.person);
        app.highlight($(this));
      });
    });
  }
};

app.init();
