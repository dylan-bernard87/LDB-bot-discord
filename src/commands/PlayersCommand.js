import { Message } from 'discord.js';
import { BroCollection } from '../collections/index.js';

export default class PlayersCommand
{
	BASE = '&players';
    DESCRIPTION = 'List last players stored with command &bros';
    EXAMPLE = '&players';

    /**
     * @type {BroCollection}
     */
    broCollection;

	constructor() {
		this.broCollection = new BroCollection();
	}

    /**
     * Try to list last players stored in bro collection
     *
     * @param {Message} message
     */
	async run(message) {
		this.message = message;

		let players = await this.broCollection.getLastPlayers(this.message.guild.name);

		if (players.length < 1)
		{
			this.sendListBrosEmpty();
			return;
		}

		this.sendListBrosResponse(players);
	}

    /**
     * Send a response to the user : List of the current players
     *
     * @param {Array<string>} players
     */
	sendListBrosResponse(players) {
		let response = `Voici les bros : `;
		players.forEach(pl => response += `${pl} `);
		this.message.channel.send(response);
	}

    /**
     * Send a response to the user : No current players case
     */
	sendListBrosEmpty() {
		let response = `Merci de sélectionner les bros (&bros player_list)`;
		this.message.channel.send(response);
	}
}
