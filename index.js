// Init .env
import './configEnv.js';

import BotDiscord from './src/BotDiscord.js';
import { BrosCommand, InvokeCommand, HelpCommand, PlayersCommand } from "./src/commands/index.js";

// Launch app
let bot = new BotDiscord();

// Init command
bot.addCommand(new InvokeCommand());
bot.addCommand(new PlayersCommand());
bot.addCommand(new BrosCommand());
// Help Command should be the last to be added
bot.addCommand(new HelpCommand());

// Launch bot
bot.loginClient();
bot.bindEvent();
