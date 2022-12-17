import fs from "fs";
import { Client, GatewayIntentBits, Message } from "discord.js";
import { HelpCommand } from "./commands/index.js";
import { exit } from "process";

export default class BotDiscord extends Client {

	FILE_LOGS = 'logs/connection.log';
    commands = [];

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
			],
		});
	}

	loginClient() {
		this.login(process.env.KEYCLIENT);
	}

    /**
     * Listen discord event
     */
	bindEvent() {
		this.on('ready', this.connectionLog);
		this.on('messageCreate', this.runCommand);
	}

    /**
     * Log activity in connection.log
     */
	connectionLog() {
		const currentDate = Date('now');
		const data = `Connected the : ${currentDate} \n`;

		fs.appendFile(this.FILE_LOGS, data, function(error) {
			if (error){	return console.log(error);}
			console.log('LDB is connected');
		});
	}

    /**
     * Add command to the bot list
     */
    addCommand(command) {
        this.commands.push(command);

        if (command instanceof HelpCommand) {
            command.bindCommands(this.commands);
        }
    }

    /**
     * Check if the message is a known Command.
     *
     * @param {Message} message
     */
	runCommand(message) {
        this.commands.forEach(com => {
            let regexCommand = new RegExp(`^${com.BASE}`);
            if (message.content.search(regexCommand) !== -1)
            {
                com.run(message);
                return;
            }
        });
	}
}
