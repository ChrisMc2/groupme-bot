function processor(request) {
  roller = require('./roller');
  commands = require('./commands');

  var input = request.body.text;
  var name = request.body.name.split(" ");

  function timeDiff(firstDate = new Date("10/20/2016")) {
    let secondDate = new Date(Date.now());
    return (Math.ceil(-1 * (secondDate.getTime() - firstDate.getTime()) / (1000 * 3600)));
  }

  if (input.indexOf("bot ") == 0) {
    var command = input.trim().split(" ");

    try {
      var result = commands[command[1]](request, command);
      return result;
    } catch (error) {
      console.log(error);
      if (error instanceof TypeError) {
        return (`${command[1]} is not a command`);
      }
      else { throw error; }
    }

  } else if ((input.toLowerCase().indexOf("remind noah") != -1)) {
    return (`Noah, ${name[0]} would like to remind you to buy dice. You have now been without dice for ${Math.ceil(-1 * timeDiff() / 24) - 1} days.`);
  } else if (input.indexOf("When is the next session?") != -1) {
    return (`The next session is never`);
  } else return undefined;

}

module.exports = processor;