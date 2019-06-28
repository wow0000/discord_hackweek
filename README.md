# BEAUTIFIER 2000
This incredible bot will use computer vision to place a serious filter on an image.
![](http://i63.tinypic.com/16geqg3.png)

![](http://i64.tinypic.com/2zs8huw.png)

![](http://i68.tinypic.com/4r5gzn.png)

![](http://i63.tinypic.com/2motcfl.png)

Or some bugs

![](http://i68.tinypic.com/ke962x.png)

# BUT HOW TO USE IT ? 
>_*rofl_
for a random image

>_*search URL_
for a image that you choosed

![](http://i66.tinypic.com/2zrdocl.png)

# Features

- Face recognition with the position of the face to adjust the filter

- Have bugs that are actualy funny (a big one)

- Two commands that are easy to remember "rofl & search"
 
- Image downloading and crop to something square

- Awesome filters

- Easy to setup

- Configurable

# Acknowledgement
[pico.js](https://github.com/tehnokv/picojs) for the face recognition and the cascade

[discord.js](https://discord.js.org/)

[images](https://www.npmjs.com/package/images) to merge images and resize them

A friend that made the cute pokemon, animal crossing and discord filters :) She's in the team !

# Installation
Requirements: Node in a recent version (10.16.0 used by the creator) and npm

> npm install

Fill your discord bot token in the config.json file

> node index.js

enjoy ( ͡° ͜ʖ ͡°) 

# What does the console text means ?
![](http://i64.tinypic.com/2jc61ll.png)
This console text is not random garbage but data to proper face recognition and debug in case of a bad image

* The first lines with "Logged: " is the filters that will be randomly choosed in the filters/ folder

* cascade loaded is the download of an external cascade used to determine a face on a black and white background [Cascades][https://becominghuman.ai/face-detection-using-opencv-with-haar-cascade-classifiers-941dbb25177]

* The rdy A.K.A. ready line is when the bot actualy listen to commands and is connected to discord servers


## The following lines are triggered by the use of a command like search or rofl

* (Number1) The width and the height is the size of the image that should be a square. I'll be resized if it isnt, don't worry :P

* (Number2) 159 in this screenshot is the score of the face detection the minimum is 5

* (Number3) x,y and radius are the pixel where the middle of the face is detected the radius is kind of the size of the head

* true means that the face has been well recognised and should be sent

* sent means that the image has been sent through an attachement in the same discord channel

# How can I change the config file without breaking git ?
![](http://i68.tinypic.com/2hs0iz8.png)

> git update-index --assume-unchanged config.json

This command will forgot the tracking of config.json :///
