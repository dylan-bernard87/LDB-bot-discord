const dotenv = require('dotenv').config({ path: './.env' });

const BotDiscordClass = require('./App/BotDiscord.js');

/* Require Command */
const InvokeCommandClass = require('./Command/InvokeCommand.js');
const HelpCommandClass = require('./Command/HelpCommand.js');
const PlayerCommandClass = require('./Command/PlayerCommand.js');
const BrosCommandClass = require('./Command/BrosCommand.js');

/* Require mongoDB class */
const UsersClass = require('./Database/Users.js');
const GamesClass = require('./Database/Games.js');
const BrosClass = require('./Database/Bros.js');

const dbName = process.env.DATABASE_NAME;

/* Instance entity mongoDb */
let Users = new UsersClass(dbName);
let Games = new GamesClass(dbName);
let Bros = new BrosClass(dbName);

/* Instance Command */
let invokeCommand = new InvokeCommandClass(Users, Games, Bros);
let helpCommand = new HelpCommandClass();
let playerCommand = new PlayerCommandClass(Bros);
let brosCommand = new BrosCommandClass(Bros);

let LDPBot = new BotDiscordClass(invokeCommand, helpCommand, playerCommand, brosCommand);

LDPBot.loginClient();
LDPBot.handleEvent();
