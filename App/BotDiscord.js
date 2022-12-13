const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

module.exports =
class BotDiscord extends Client {

	FILE_LOGS = './Logs/connection.log';

	constructor(invokeCommand, helpCommand, playerCommand, brosCommand) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
		});
		this.invokeCommand = invokeCommand;
		this.helpCommand = helpCommand;
		this.playerCommand = playerCommand;
		this.brosCommand = brosCommand;
	}

	loginClient() {
		this.login(process.env.KEYCLIENT);
	}

	handleEvent() {
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
