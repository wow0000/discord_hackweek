# BEAUTIFIER 2000
This incredible bot will use computer vision to place a serious filter on an image.

[Test this bot !](https://discord.gg/zCMwZaD)

![](https://i.imgur.com/J6TIAKo.png)

![](https://i.imgur.com/hfbHesB.png)

![](https://i.imgur.com/a4ox9ju.png)

![](https://i.imgur.com/fVAtRpT.png)

Or some bugs

![](https://i.imgur.com/nlm9lL4.png)

# BUT HOW TO USE IT ? 
>_*rofl_
for a random image

>_*search URL_
for a image that you choosed

![](https://i.imgur.com/t8Eg7Z3.png)

# Features

- Face detection with the position of the face to adjust the filter

- Have bugs that are actualy funny (a big one)

- Two commands that are easy to remember "rofl & search"
 
- Image downloading and crop to something square

- Awesome filters

- Easy to setup

- Configurable

# Acknowledgement
[pico.js](https://github.com/tehnokv/picojs) for the face detection and the cascade

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
![](https://i.imgur.com/5J97u3m.png)
This console text is not random garbage but data to proper face detection and debug in case of a bad image

* The first lines with "Logged: " is the filters that will be randomly choosed in the filters/ folder

* cascade loaded is the download of an external cascade used to determine a face on a black and white background [Cascades][https://becominghuman.ai/face-detection-using-opencv-with-haar-cascade-classifiers-941dbb25177]

* The rdy A.K.A. ready line is when the bot actualy listen to commands and is connected to discord servers


## The following lines are triggered by the use of a command like search or rofl

* (Number1) The width and the height is the size of the image that should be a square. I'll be resized if it isnt, don't worry :P

* (Number2) 159 in this screenshot is the score of the face detection the minimum is 5

* (Number3) x,y and radius are the pixel where the middle of the face is detected the radius is kind of the size of the head

* true means that the face has been well detected and should be sent in the next step 

* sent means that the image has been sent through an attachement in the same discord channel

# How can I change the config file without breaking git ?
![](https://i.imgur.com/AXL93DN.png)

> git update-index --assume-unchanged config.json

This command will forgot the tracking of config.json :///

# How can I improve results from the face detection ?

In the config file there is 2 values:
- "minimalscore": It's the minimal score to detect a face, by default it's 5.0, a higher number may take more time to find an image

- "minimalsize": It's the minimum radius in pixel that the face should exceed to show on the screen. A small value will make bugs in the face detection, a high value may break face detection on images
