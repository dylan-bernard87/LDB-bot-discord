const Discord = require('discord.js');
const dotenv = require('dotenv').config({ path: './.env' });

const BotDiscordClass = require('./App/BotDiscord.js');
const InvokeCommandClass = require('./Command/Invoke.js');
const HelpCommandClass = require('./Command/Help.js');
const UsersClass = require('./Database/Users.js');
const GamesClass = require('./Database/Games.js');

const url = process.env.DATABASE_URL;
const dbName = process.env.DATABASE_NAME;

// Entity mongoDb
let Users = new UsersClass(url, dbName);
let Games = new GamesClass(url, dbName);

let invokeCommand = new InvokeCommandClass(Users, Games);
let helpCommand = new HelpCommandClass();

let LDPBot = new BotDiscordClass(invokeCommand, helpCommand);

LDPBot.loginClient();
LDPBot.handleEvent();