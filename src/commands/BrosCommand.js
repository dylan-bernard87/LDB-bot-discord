import { Message } from 'discord.js';
import { BroCollection } from '../collections/index.js';

export default class BrosCommand {

    BASE = '&bros';
    DESCRIPTION = 'Update the list of the current players';
    EXAMPLE = '&bros @player_1 @player_2';

    ERR_CODE_BROS_NOT_DETECTED = 0;
    ERR_CODE_INTERNAL_ERROR = 1;

    /**
     * @type {BroCollection}
     */
    broCollection;

    constructor() {
        this.broCollection = new BroCollection();
	}

    /**
     * Try to register in db, the players configured by the user
     *
     * @param {Message} message
     */
	async run(message) {
		this.message = message;
		const content = message.content;

		let players = this.cleanContent(content);

		if (players.length < 1) {
			this.sendErrorResponse(this.ERR_CODE_BROS_NOT_DETECTED);
			return;
		}

		let resultInsertBro = await this.broCollection.insertBro(players, this.message.guild.name);

		if (!resultInsertBro) {
			this.sendErrorResponse(this.ERR_CODE_INTERNAL_ERROR);
			return;
		}

		this.sendSuccessResponse();
	}

    /**
     * Transform the content send by the user in a list of players
     *
     * @param {string} content
     * @returns {Array<string>}
     */
    cleanContent(content) {
        let contentWithoutBase = content.slice(this.BASE.length + 1);
        let contentSplit = contentWithoutBase.split(' ');
        let regex = new RegExp(`^<@[a-z0-9]+>$`);

        let players = contentSplit.filter(function(el) {
            if (el.search(regex) !== -1) return el;
        })

        return players;
    }

    /**
     * Error case : Send a specific message to the user according to errCode
     *
     * @param {number} errCode
     */
	sendErrorResponse(errCode) {
		let response = '';

		switch (errCode) {
			case this.ERR_CODE_BROS_NOT_DETECTED:
				response = this.generatePlayersNotDetectedErrorMessage();
				break;
			case this.ERR_CODE_INTERNAL_ERROR:
				response = this.generateInternalErrorMessage();
				break;
            default:
                response = this.generateInternalErrorMessage();
                break;
		}

		// send message
		this.message.channel.send(response);
	}

    /**
     * Generate error message : Players not found in the message
     *
     * @returns {string}
     */
	generatePlayersNotDetectedErrorMessage() {
		let message = 'Merci de donner au moins un **"BROS"** valide !';
		return message;
	}

    /**
     * Generate error message : Internal error
     *
     * @returns {string}
     */
	generateInternalErrorMessage() {
		let message = '**OOPS une erreur interne est survenue :/**';
		return message;
	}

    /**
     * Send success message to the user
     */
	sendSuccessResponse() {
		let response = 'Votre demande a bien été prise en compte !';
		this.message.channel.send(response);
	}
}
