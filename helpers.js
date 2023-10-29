const hbs = require('hbs');

hbs.registerHelper('Home', function() {
  return 'Home Helper Output';
});

module.exports = hbs;