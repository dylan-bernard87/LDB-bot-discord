import { Message } from 'discord.js';
import { BroCollection , GameCollection, UserCollection } from '../collections/index.js';

export default class InvokeCommand
{
	BASE = '&invoke';
    DESCRIPTION = 'Invoke the last of the bros for a specific game';
    EXAMPLE = '&invoke RL';

	ERR_CODE_GAME_NOT_PRESENT = 0;
	ERR_CODE_USER_INVOKE = 1;
	ERR_CODE_INTERNAL_ERROR = 2;

    /**
     * @type {UserCollection}
     */
    userCollection;
    /**
     * @type {GameCollection}
     */
    gameCollection;
    /**
     * @type {BroCollection}
     */
    broCollection;

	constructor() {
		this.userCollection = new UserCollection();
		this.gameCollection = new GameCollection();
		this.broCollection = new BroCollection();
	}

    /**
     * Start the process of Invoke command
     *
     * @param {Message} message
     */
	run(message) {
		this.message = message;
		let copyMessage = message.content;
		let gameSelected = copyMessage.slice(this.BASE.length + 1);

		this.determineResponse(gameSelected);
	}

    /**
     * Controller method that determine the right response for the user
     *
     * @param {string} gameSelected
     */
	async determineResponse(gameSelected) {
		// Check if gameSelected is in database.
		let game = await this.gameCollection.searchGame(gameSelected);

		if (game === null) {
			this.sendErrorResponse(this.ERR_CODE_GAME_NOT_PRESENT);
			return;
		}

        // Check if user has already called this command in the last 12 hours
		const user = await this.userCollection.getUserInvokeEarly(this.message.author.username, this.message.guild.name);

		if (user !== null)	{
			this.sendErrorResponse(this.ERR_CODE_USER_INVOKE);
			return;
		}

		const players = await this.broCollection.getLastPlayers(this.message.guild.name);

		if (players.length <= 0) {
			this.sendErrorResponse(this.ERR_CODE_INTERNAL_ERROR);
			return;
		}

        // Insert the current user to the db
		const resultInsertUser = await this.userCollection.insertUsersAction(game, this.message.author.username, this.message.guild.name);

		if (!resultInsertUser) {
			this.sendErrorResponse(this.ERR_CODE_INTERNAL_ERROR);
			return;
		}

		this.sendSuccessResponse(game.name, players);
	}

    /**
     * Success case : Send message to the user
     *
     * @param {string} game
     * @param {Array<string>} players
     */
	sendSuccessResponse(gameName, players) {
		let response = `**LA LAST DES BROS** est invoqué par ${this.message.author} ! \n`;
		response += `Jeu : **${gameName}** \n`;
		response += `Joueurs : `;

		players.forEach(pl => response += `${pl} `);

		this.message.channel.send(response)
	}

    /**
     * Error case : Send a specific message to the user according to errCode
     *
     * @param {number} errCode
     */
	async sendErrorResponse(errCode)	{
		let response = '';

		switch (errCode)
		{
			case this.ERR_CODE_GAME_NOT_PRESENT:
				response = await this.generateErrorMessageGame();
				break;
			case this.ERR_CODE_USER_INVOKE:
				response = this.generateErrorUserInvoke();
				break;
			case this.ERR_CODE_INTERNAL_ERROR:
				response = this.generateInternalErrorMessage();
				break;
            default:
                response = this.generateInternalErrorMessage();
                break;
		}

		this.message.channel.send(response)
	}

    /**
     * Generate error message : Game not present in db
     *
     * @returns {string}
     */
	async generateErrorMessageGame()	{
		let message = 'Le jeu que vous avez choisi n\'est pas présent dans ma liste \n';
		message += 'Voici la liste des jeux disponibles : \n';

		let gameFromDb = await this.gameCollection.getAllGames();
		gameFromDb.forEach(g => {
			message += `** - ${g.name} (${g.abbrv}) ** \n`;
		});

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
     * Generate error message : User call this command in the last 12 hours
     *
     * @returns {string}
     */
	generateErrorUserInvoke() {
		let message = `${this.message.author}, vous n'avez pas encore le droit d'invoquer la **'Last Des Bros'**. \n`;
		message += "**Info : **Le délai entre chaque 'invoke' est de 12 heures";

		return message;
	}
}
