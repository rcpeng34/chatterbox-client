var engine = {};

engine.regex = /{{\s*[\w.]+\s*}}/g;
// E.g. templateSelector = messageTemplate
// data = { username: '<script>alert("turtles");</script>', description: 'i like turtles' }

engine.generateRegex = function(keyword) {
  return new RegExp('{{ ' + keyword + ' }}', 'g');
};

engine.render = function(templateSelector, data) {
  var template = document.getElementById(templateSelector);
  var newInnerHtml = template.innerHTML;
  for(var key in data) {
    newInnerHtml = newInnerHtml.replace(engine.generateRegex(key), data[key]);
  }

  return $(newInnerHtml)[0];
};
