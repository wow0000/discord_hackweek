const Discord = require('discord.js');
const {
  Client,
  Attachment
} = require('discord.js');

const client = new Client();
const path = require('path');
const Canvas = require('canvas');
const images = require("images");

var config = require('./config.json');
var fs = require('fs');
var request = require('request');
//var face = require("pico.min.js");

client.on('ready', () => {
  //Clean the cache
  fs.readdir(config.app.download, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(config.app.download, file), err => {
        if (err) throw err;
      });
    }
  });

  console.log(`rdy ${client.user.tag}!`);

});

client.on('message', msg => {
    cmsg = msg
    if (msg.content === '!rofl') {
      var imageID = getRandomInt(666);
      var filename = config.app.download + imageID.toString() + ".png"
      download(msg, filename, function() {
        var attach = new Attachment(convertImages(filename));
        msg.channel.send(attach);
      });
    };
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};


//https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
function download(msg, filename, callback) {

  request.head(config.app.link, function(err, res, body) {
    if (err) {
      msg.reply("Error while getting the image :////")
      return;
    }
    request(config.app.link).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

function convertImages(filename)
{
  images(filename).draw(images("filters/1.png"), 0, 0).save(filename+".r.png");
  return filename+".r.png";
}

client.login(config.discord.token);
