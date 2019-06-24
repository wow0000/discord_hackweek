const Discord = require('discord.js');
const client = new Discord.Client();

var Twitter = require('twitter');
var config = require('./config.json');

var tw_client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

var tw_params = {screen_name: 'nodejs'};

client.on('ready', () => {
  console.log(`rdy ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!rofl') {
    msg.reply('Pong!');
  }
});

client.login(config.discord.token);
