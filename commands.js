var commands = {};

commands.setSession = function () {
    console.log("It worked");
}

commands.testing = function () {
    console.log("It worked");
}

commands.roll = function (request, args) {
    var commandParsed = {};
    commandParsed.errors = [];
    for (let i = 2; i < args.length; i++) {
        try {
            switch (args[i]) {
                case "-l":
                    commandParsed.level = parseInt(args[i + 1]);
                    if (commandParsed.level == null) { commandParsed.errors.push("Level must be given an argument.") }
                    break;
                case "-m":
                    commandParsed.manual = true;
                    break;
                case "-a":
                    commandParsed.advantage = parseInt(args[i + 1]);
                    if (Number.isNaN(commandParsed.advantage)) commandParsed.advantage = 0;
                    break;
                case "-d":
                    commandParsed.disadvantage = parseInt(args[i + 1]);
                    if (Number.isNaN(commandParsed.disadvantage)) commandParsed.disadvantage = 0;
                    break;
                case "-q":
                    commandParsed.quiet = true;
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            console.log("Syntax error - you're probably missing an argument");
        }
    }
    return roller(commandParsed, request);
}

module.exports = commands;