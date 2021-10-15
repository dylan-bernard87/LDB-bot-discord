const { Client, Message } = require('discord.js');
const fs = require('fs');

module.exports = 
class BotDiscord extends Client
{
	fileLogs = './Logs/connection.log';

	constructor(invokeCommand, helpCommand)
	{
		super();
		this.invokeCommand = invokeCommand;
		this.helpCommand = helpCommand;
	}
	
	loginClient()
	{
		this.login(process.env.KEYCLIENT);
	}

	handleEvent()
	{
		this.on('ready', this.connectionLog);
		this.on('message', this.handleResponseUser);
	}

	connectionLog()
	{
		const currentDate = Date('now');
		const data = 'Connected the : ' + currentDate + '\n';

		fs.appendFile(this.fileLogs, data, function(error){
			if (error){	return console.log(error);}
			console.log('LDB is connected');
		});
	}

	handleResponseUser(message)
	{
		let regexForPing = new RegExp(`${this.user.id}`);
		let regexInvoke = new RegExp(`^${this.invokeCommand.BASE}`);
		let regexBros = '.../';
		let regexHelp = new RegExp(`^${this.helpCommand.BASE}`);

		if (message.content.search(regexInvoke) !== -1)
		{
			this.invokeCommand.handleMessage(message);
		}
		else if (message.content.search(regexBros) !== -1)
		{
			// this.brosCommand.handleMessage(message);
		}
		else if (message.content.search(regexHelp) !== -1 || message.content.search(regexForPing) !== -1)
		{
			this.helpCommand.handleResponse(message);
		}
	}
}