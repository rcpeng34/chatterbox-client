var app = {
  init: function() {
    //Do something here
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    this.fetch();
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
    for (var i = 0; i < msgArray.length; i++) {
      var message = msgArray[i];
      // debugger;
      // console.log(message);
      var username = message.username;
      var text = message.text;
      var $messageNode = $('<div class = "chat" ></div>');
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
