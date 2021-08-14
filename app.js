const Discord = require('discord.js');
const dotenv = require('dotenv').config({ path: './.env' });

const BotDiscordClass = require('./App/BotDiscord.js');
const InvokeCommandClass = require('./Command/Invoke.js');

let invokeCommand = new InvokeCommandClass();
let LDPBot = new BotDiscordClass(invokeCommand);

LDPBot.loginClient();
LDPBot.handleEvent();