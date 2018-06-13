const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var port = process.env.PORT || 3000;

function timeDiff() {
    let firstDate = new Date("10/20/2016"), secondDate = new Date(Date.now());
    return (Math.ceil(Math.abs(secondDate.getTime() - firstDate.getTime())/ (1000*3600*24))-1);
}

var server = app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
})


/* Actual = 949fddbf3b7361f1c676aae09b */
/* Dev = 9c6d356203b7500b808df7992c */

app.get('/', (req, res) => {
    res.status(403).json({"Allow": "POST"});
})

app.post('/', (req, res) => {
    if ((req.body.text.indexOf("remind Noah")!=-1) || (req.body.text.indexOf("Remind Noah")!=-1)) {
        let name = req.body.name.split(" ");
        console.log("Processed post request")
        res.json({
            "bot_id": "9c6d356203b7500b808df7992c",
            "text": `Noah, ${name[0]} would like to remind you to buy dice. You have now been without dice for ${timeDiff()} days.`
        })
   } else {
       console.log("Rejected invalid post resquest")
       res.status(200).send("No Response Required")
   }
})

async function remind() {
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