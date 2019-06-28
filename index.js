require("./pico.min.js");

const Discord = require('discord.js');
const path = require('path');
const fetch = require('node-fetch');
const {
  createCanvas,
  loadImage
} = require('canvas')
const images = require("images");

const config = require('./config.json');
const fs = require('fs');
const request = require('request');

var filters = [];

const {
  Client,
  Attachment
} = require('discord.js');
const client = new Client();

//Filling the filters array
fs.readdirSync(config.app.filters).forEach(file => {
  console.log("Logged: "+file.toString());
  filters.push(file);
});

//Init face recognition variables

var facefinder_classify_region = function(r, c, s, pixels, ldim) {
  return -1.0;
};
var cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder'; //thx nenadmarkus
fetch(cascadeurl).then(function(response) {
  response.arrayBuffer().then(function(buffer) {
    var bytes = new Int8Array(buffer);
    facefinder_classify_region = pico.unpack_cascade(bytes);
    console.log('* cascade loaded');
  })
})

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

function imageSearch(msg, url) {
  var imageID = getRandomInt(666);
  var filename = config.app.download + imageID.toString() + ".png"
  download(msg, filename, url, function() {
    facedetect(filename, msg, function(data) {
      if (data.success === false) {
        if (typeof url !== "boolean") {
          msg.reply("No faces found in this image. :///\nFor best results the image should be a square like 400x400 Twitter profile images haves the best results");
          return;
        }
        console.log("False retrying...")
        imageSearch(msg, false);
        return;
      }
      var attach = new Attachment(convertImages(filename, data));
      msg.channel.send(attach);
      console.log("sent");
    });
  });
}

client.on('message', msg => {
  var words = msg.cleanContent.split(' ');
  if (words[0] === '*rofl') {
    msg.reply("Searching...")
    imageSearch(msg, false);
  } else if (words[0] === '*search') {
    if (words[1] === undefined) {
      msg.reply("Usage: *search http://incredible.com/myimage.jpg")
      return;
    }
    msg.reply("Searching for this image")
    imageSearch(msg, words[1]);
  }

});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};


//https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
function download(msg, filename, url, callback) {
  var link = config.app.link;
  if (typeof url !== "boolean") {
    link = url;
  }
  request.head(link, function(err, res, body) {
    if (err) {
      console.log(err);
      msg.reply("Error while getting the image :////")
      return;
    }
    request(link).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

function convertImages(filename, data) {
  console.log(data.success); //true
  //random filters choose
  var id = getRandomInt(filters.length);
  images(filename).draw(images(config.app.filters+filters[id]).resize(data.radius), data.x - (data.radius / 2), data.y - (data.radius / 2)).save(filename + ".r.png");
  return filename + ".r.png";
}

/*
    a function to transform an RGBA image to grayscale
    https://github.com/tehnokv/picojs/blob/master/img/index.html <3<3
  */
function rgba_to_grayscale(rgba, nrows, ncols) {
  var gray = new Uint8Array(nrows * ncols);
  for (var r = 0; r < nrows; ++r)
    for (var c = 0; c < ncols; ++c)
      // gray = 0.2*red + 0.7*green + 0.1*blue
      gray[r * ncols + c] = (2 * rgba[r * 4 * ncols + 4 * c + 0] + 7 * rgba[r * 4 * ncols + 4 * c + 1] + 1 * rgba[r * 4 * ncols + 4 * c + 2]) / 10;
  return gray;
}

function facedetect(fileurl, msg, callback) {
  var imageapi = images(fileurl);
  var xy = imageapi.size();
  console.log(xy);
  if (xy.width !== xy.height) {
    msg.reply("Image isnt squared. It'll be resized and the accuracy wont be as good.");
    imageapi.resize(xy.width, xy.width).save(fileurl);
    var imageapi = images(fileurl);
    xy = imageapi.size();
  }
  var ctx = createCanvas(xy.width, xy.height).getContext('2d');
  var img = loadImage(fileurl);
  img.then(function(nik) {
    ctx.drawImage(nik, 0, 0);

    var rgba = ctx.getImageData(0, 0, xy.width, xy.height).data;
    // prepare input to `run_cascade`
    image = {
      "pixels": rgba_to_grayscale(rgba, xy.height, xy.width),
      "nrows": xy.width,
      "ncols": xy.height,
      "ldim": xy.height
    }
    params = {
      "shiftfactor": 0.1, // move the detection window by 10% of its size
      "minsize": 20, // minimum size of a face (not suitable for real-time detection, set it to 100 in that case)
      "maxsize": 1000, // maximum size of a face
      "scalefactor": 1.1 // for multiscale processing: resize the detection window by 10% when moving to the higher scale
    }
    // run the cascade over the image
    // dets is an array that contains (r, c, s, q) quadruplets
    // (representing row, column, scale and detection score)
    dets = pico.run_cascade(image, facefinder_classify_region, params);
    // cluster the obtained detections
    dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
    // draw results
    qthresh = 5.0 // this constant is empirical: other cascades might require a different one
    for (i = 0; i < dets.length; ++i) {
      // check the detection score
      // if it's above the threshold, draw it
      console.log(dets[i][3])
      if (dets[i][3] > qthresh && dets[i][2] > 60) { //Compare score && radius size
        console.log("x: " + dets[i][1], "y: " + dets[i][0], "radius: " + dets[i][2]);
        callback({
          success: true,
          x: dets[i][1],
          y: dets[i][0],
          radius: dets[i][2],
          prob: dets[i][3]
        });
        return;
      }

    }
    callback({
      success: false,
      x: 0,
      y: 0,
      radius: xy.height,
      prob: 0
    });
    return;
  }).catch(err => {
    console.log('oh no!', err)
  })
}

client.login(config.discord.token);
