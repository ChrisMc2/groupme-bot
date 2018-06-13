const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var port = process.env.PORT || 3000;
var nextSession = new Date("10/20/2016");

function timeDiff(firstDate = new Date("10/20/2016")) {
    let secondDate = new Date(Date.now());
    return (Math.ceil(-1*(secondDate.getTime() - firstDate.getTime())/ (1000*3600)));
}

var server = app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
})


/* Actual = 949fddbf3b7361f1c676aae09b */
/* Dev = 9c6d356203b7500b808df7992c */

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Expose-Headers', 'Access-Controll-Allow-Methods');
    res.status(403).send("Not Allowed");
})

app.post('/', (req, res) => {
    var command = req.body.text.split(" ");

    if ((command[0]==="bot") && (command.length >= 2))  {
        let fun = global[command[1]];
        if (typeof fun === "function") fun(command);
        else makePost("Invalid command");
        res.status(200).send("Handled by function");

    } else if ((req.body.text.indexOf("remind Noah")!=-1) || (req.body.text.indexOf("Remind Noah")!=-1)) {
        let name = req.body.name.split(" ");

        console.log("Processed post request");
        makePost(`Noah, ${name[0]} would like to remind you to buy dice. You have now been without dice for ${Math.ceil(-1*timeDiff()/24)-1} days.`);
        res.sendStatus(200);
    } else if (req.body.text.indexOf("When is the next session?")!=-1) {
        var until = timeDiff(nextSession);
        if (until > 0) {
            makePost(`The next session is in ${Math.floor(until/24)} day and ${until%24} hours`);
        } else {
            makePost(`The next session hasn't been scheduled yet. Feel free to set it using the call "bot setSession yyyy-mm-dd-hh-mm-ss"`);
        }
        res.sendStatus(200);
    } else {
       console.log("Rejected invalid post resquest")
       res.status(400).send("Not a valid GroupMe Post")
   }
})

async function scheduleRemind() {
    axios.post('https://api.groupme.com/v3/bots/post', {
        "bot_id": "9c6d356203b7500b808df7992c",
        "text": `Hi, Noah. This is your scheduled reminder to buy dice. You have now been without dice for ${timeDiff()} days.`
        })
      .then(function (response) {
      })
      .catch(function (error) {
          console.log(error);
      });
};

async function makePost(text) {
    axios.post('https://api.groupme.com/v3/bots/post', {
        "bot_id": "9c6d356203b7500b808df7992c",
        "text": text
    })
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.stack);
        });
}

async function setSession(command) {
    if (command[2] != undefined) {
        let newSession = command[2].split("-");
        nextSession = new Date(`${newSession[0]}-${newSession[1]}-${newSession[2]}T${newSession[3]}:${newSession[4]}:${newSession[6]}`);
        makePost("Session set!");
    }
};