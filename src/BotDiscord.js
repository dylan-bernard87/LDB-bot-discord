import fs from "fs";
import { Client, GatewayIntentBits } from "discord.js";

import {
    BrosCommand,
    InvokeCommand,
    HelpCommand,
    PlayerCommand
} from "./command/index.js";

export default class BotDiscord extends Client {

	FILE_LOGS = 'logs/connection.log';

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
		});
		this.invokeCommand = new InvokeCommand();
		this.helpCommand = new HelpCommand();
		this.playerCommand = new PlayerCommand();
		this.brosCommand = new BrosCommand();

        this.loginClient();
        this.bindEvent();
	}

	loginClient() {
		this.login(process.env.KEYCLIENT);
	}

	bindEvent() {
		this.on('ready', this.connectionLog);
		this.on('messageCreate', this.handleResponseUser);
	}

	connectionLog() {
		const currentDate = Date('now');
		const data = 'Connected the : ' + currentDate + '\n';

		fs.appendFile(this.FILE_LOGS, data, function(error) {
			if (error){	return console.log(error);}
			console.log('LDB is connected');
		});
	}

	handleResponseUser(message) {
		let regexForPing = new RegExp(`${this.user.id}`);
		let regexInvoke = new RegExp(`^${this.invokeCommand.BASE}`);
		let regexPlayer = new RegExp(`^${this.playerCommand.BASE}`);
		let regexBros = new RegExp(`^${this.brosCommand.BASE}`);
		let regexHelp = new RegExp(`^${this.helpCommand.BASE}`);

		if (message.content.search(regexInvoke) !== -1)
		{
			this.invokeCommand.handleMessage(message);
		}
		else if (message.content.search(regexBros) !== -1)
		{
			this.brosCommand.handleMessage(message);
		}
		else if (message.content.search(regexPlayer) !== -1)
		{
			this.playerCommand.handleMessage(message);
		}
		else if (message.content.search(regexHelp) !== -1 || message.content.search(regexForPing) !== -1)
		{
			this.helpCommand.handleResponse(message);
		}
	}
}
