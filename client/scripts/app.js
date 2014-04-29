var app = {
  init: function() {
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
    var that = this;
    this.currentMessages;
    setInterval(function() {
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
      url: app.server + '?order=-createdAt',
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
    for (var i = msgArray.length-1; i >= 0; i--) {
      var message = msgArray[i];
      var username = message.username;
      var text = message.text;
      var $messageNode = $('<div class = "chat" data-message-id = "' + message.objectId + '"></div>');
      var $usernameNode = $('<div class = "username"></div>');
      $usernameNode.text(username);
      var $textNode = $('<div class = "text"></div>');
      $textNode.text(text + " @: " + message.createdAt);
      $messageNode.append($usernameNode);
      $messageNode.append($textNode);
      $('#messages').append($messageNode);
      if ($('.chat').length > 100) {
        $('.chat:last-child').remove();
      }
    }
  }
};

app.init();
