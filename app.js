const Discord = require('discord.js');
const dotenv = require('dotenv').config({ path: './.env' });

const BotDiscordClass = require('./App/BotDiscord.js');
const InvokeCommandClass = require('./Command/Invoke.js');
const UsersClass = require('./Database/Users.js');

const url = process.env.DATABASE_URL;
const dbName = process.env.DATABASE_NAME;

let Users = new UsersClass(url, dbName);

let invokeCommand = new InvokeCommandClass(Users);
let LDPBot = new BotDiscordClass(invokeCommand);

LDPBot.loginClient();
LDPBot.handleEvent();