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
  console.log(newInnerHtml);
  for(var key in data) {
    console.log(engine.generateRegex(key));
    console.log('key', key);
    console.log('value', data[key]);
    // newInnerHtml.toString();
    newInnerHtml = newInnerHtml.replace(engine.generateRegex(key), data[key]);
  }
  console.log(newInnerHtml);

  return $(newInnerHtml)[0];
};
