const Discord = require('discord.js');
const client = new Discord.Client();

var config = require('./config.json');

client.on('ready', () => {
  console.log(`rdy ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!rofl') {
    msg.reply('Pong!');
  }
});

client.login(config.discord.token);
