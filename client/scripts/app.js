var app = {
  init: function() {
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    var that = this;
    setInterval(function() {
      console.log('fetching new shiz');
      that.fetch();
    }, 5000);
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
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
        console.log(data);
        app.display(data.results);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },
  display: function(msgArray) {
    var currentNewest = $('.chat')[0] || null;
    var refreshedArray;
    if (currentNewest === null) {
      refreshedArray = msgArray;
    } else {
      for (var i = 0; i < msgArray.length; i++) {
        if (msgArray[i].objectId === $(currentNewest).data('message-id')) {
          refreshedArray = msgArray.slice(i+1);
        }
      }
    }

    for (var i = refreshedArray.length-1; i >= 0; i--) {
      var message = refreshedArray[i];
      var username = message.username;
      var text = message.text;
      var $messageNode = $('<div class = "chat" data-message-id = "' + message.objectId + '"></div>');
      var $usernameNode = $('<div class = "username"></div>');
      $usernameNode.text(username);
      var $textNode = $('<div class = "text"></div>');
      $textNode.text(text);
      $messageNode.append($usernameNode);
      $messageNode.append($textNode);
      $('#messages').append($messageNode);
    }
  }
};

app.init();
