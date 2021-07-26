const Discord = require('discord.js');
const dotenv = require('dotenv').config({ path: './.env' });

const BotDiscordClass = require('./App/BotDiscord.js');

let LDPBot = new BotDiscordClass();
LDPBot.loginClient();

// console.log(LDPBot);

// 
// botDiscord.handleEvent();


// Client.on('ready', function(ev){
//     Discord.message(Client, 'C\'est partie !','général');
// })

// Client.on("message", function(message){

//     // console.log(message);
// })

// connexionMessage(ev)
// {
    // const data = 
    // {
    // 	id: 'test',
    // 	type: 'text',
    // 	content: 'text',
    // 	pinned: 'text',
    // 	tts: 'text',
    // 	embed: 'text',
    // 	attachment: 'text',
    // 	nonce: '123'
    // }

    // console.log(this.client.channels);

    // let message = new Discord.Message(this.client, data, channel);
    // message.channel.send('text');
    // console.log(this.client);

    //console.log(this.channels);

    // TODO : Write in a file 
    // console.log('the Bot s connected');
// }


