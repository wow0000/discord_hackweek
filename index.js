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

const {
  Client,
  Attachment
} = require('discord.js');
const client = new Client();

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

client.on('message', msg => {
  cmsg = msg
  if (msg.content === '!rofl') {
    var imageID = getRandomInt(666);
    var filename = config.app.download + imageID.toString() + ".png"
    download(msg, filename, function() {
      facedetect(filename, function(data) {
        console.log(data);
        var attach = new Attachment(convertImages(filename, data));
        msg.channel.send(attach);
        console.log("sent");
      });
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

function convertImages(filename, data) {
  console.log(data.success); //true
  images(filename).draw(images("filters/1.png").size(data.radius), data.x-(data.radius/2), data.y-(data.radius/2)).save(filename + ".r.png");
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

function facedetect(fileurl, callback) {
  var ctx = createCanvas(600, 600).getContext('2d');
  var img = loadImage(fileurl);
  img.then(function(nik) {
    ctx.drawImage(nik, 0, 0);

    var rgba = ctx.getImageData(0, 0, 600, 600).data;
    // prepare input to `run_cascade`
    image = {
      "pixels": rgba_to_grayscale(rgba, 600, 600),
      "nrows": 600,
      "ncols": 600,
      "ldim": 600
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
    //console.log(ctx.getImageData(0,0,600,600).data);
    dets = pico.run_cascade(image, facefinder_classify_region, params);
    // cluster the obtained detections
    dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2
    // draw results
    qthresh = 5.0 // this constant is empirical: other cascades might require a different one
    for (i = 0; i < dets.length; ++i) {
      // check the detection score
      // if it's above the threshold, draw it
      if (dets[i][3] > qthresh) {
        console.log("x: " + dets[i][1], "y: " + dets[i][0], "radius: " + dets[i][2]);
        callback({
          success: true,
          x: dets[i][1],
          y: dets[i][0],
          radius: dets[i][2]
        });
        return;
      }

    }
    callback({
      success: false,
      x: 0,
      y: 0,
      radius: 600
    });
    return;
  }).catch(err => {
    console.log('oh no!', err)
  })



}

client.login(config.discord.token);
