import { BroCollection } from '../collection/index.js';

export default class PlayerCommand
{
	BASE = '&player';

	constructor(bros) {
		this.broCollection = new BroCollection();
	}

	async handleMessage(message) {
		this.message = message;

		let bros = await this.broCollection.getLastPlayers(this.message.guild.name);

		if (bros == null)
		{
			this.sendListBrosEmpty();
			return;
		}

		this.sendListBrosResponse(bros);
	}

	sendListBrosResponse(bros) {
		let response = `Voici les bros : `;
		bros.forEach(el => {
			response += `${el} `;
		});

		this.message.channel.send(response);
	}

	sendListBrosEmpty() {
		let response = `Merci de sélectionner les bros (& bros player_list)`;
		this.message.channel.send(response);
	}
}
