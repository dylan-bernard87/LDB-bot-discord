const { Client } = require('discord.js');

module.exports = 
class BotDiscord extends Client
{
	
	loginClient()
	{
		this.login(process.env.KEYCLIENT);
	}

	handleEvent()
	{
		this.client.on('ready', this.connectionLog);
	}

	connectionLog()
	{
		
	}
}