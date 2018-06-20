const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const processor = require('./input_processor');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var port = process.env.PORT || 3000;
var nextSession = new Date("10/20/2016");

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

    var response = processor(req);
    if (response !== undefined) {
      if (response.indexOf("buy dice")!=0) {
          callOutNoah(response);
      } else makePost(response);
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

function makePost(text) {
    axios.post('https://api.groupme.com/v3/bots/post', {
        "bot_id": "949fddbf3b7361f1c676aae09b",
        "text": text
    })
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.stack);
        });
}

function callOutNoah(text) {
    axios.post('https://api.groupme.com/v3/bots/post', {
        "bot_id": "949fddbf3b7361f1c676aae09b",
        "text": text,
        "attachments": [
            {
                "loci":[[text.indexOf("buy dice"), 8]],
                "type":"mentions",
                "user_ids":["39103688"]
            }
        ]
    })
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
            console.log(error.stack);
        });
}


// function setSession(command) {
//     if (command[2] != undefined) {
//         let newSession = command[2].split("-");
//         nextSession = new Date(`${newSession[0]}-${newSession[1]}-${newSession[2]}T${newSession[3]}:${newSession[4]}:${newSession[6]}`);
//         makePost("Session set!");
//     }
// }