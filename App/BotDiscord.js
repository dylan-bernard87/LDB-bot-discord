const { Client } = require('discord.js');
const fs = require('fs');

module.exports = 
class BotDiscord extends Client
{
	fileLogs = './Logs/connection.log';

	constructor(invokeCommand)
	{
		super();
		this.invokeCommand = invokeCommand;
	}
	
	loginClient()
	{
		this.login(process.env.KEYCLIENT);
	}

	handleEvent()
	{
		this.on('ready', this.connectionLog);
		this.on('message', this.handleResponseUser)
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
		let regexInvoke = new RegExp(`^${this.invokeCommand.BASE}`);

		if (message.content.search(regexInvoke) !== -1)
		{
			this.invokeCommand.handleMessage(message);
		}
	}
}