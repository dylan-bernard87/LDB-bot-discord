module.exports =
  class Invoke {
    BASE = '&invoke';
    ERR_CODE_GAME_NOT_PRESENT = 0;
    ERR_CODE_USER_INVOKE = 1;

    constructor(users, games) {
      this.users = users;
      this.games = games;
    }

    handleMessage(message) {
      this.message = message;
      let copyMessage = message.content;
      let gameSelected = copyMessage.slice(this.BASE.length + 1);

      this.determineResponse(gameSelected);
    }

    async determineResponse(gameSelected) {
      let gameSelectedCopy = gameSelected;

      // Determine if gameSelected is present in database.
      let gameDatabase = await this.games.searchGame(gameSelected);

      if (gameDatabase === undefined) {
        this.sendErrorResponse(this.ERR_CODE_GAME_NOT_PRESENT);
        return;
      }

      let user = await this.users.getUsersData(this.message.author.username);
      
      if (user.length > 0) {
        this.sendErrorResponse(this.ERR_CODE_USER_INVOKE);
        return;
      }

      this.users.insertUsersAction(gameDatabase, this.message.author.username);
      this.sendSuccessResponse(gameDatabase);
    }

    sendSuccessResponse(gameDb) {
      let response = `**LA LAST DES BROS** EST INVOQUÉ PAR ${this.message.author} pour le jeu **${gameDb.name}**`;

      // send message
      this.message.channel.send(response)
    }

    async sendErrorResponse(errCode) {
      let response = '';

      switch (errCode) {
        case this.ERR_CODE_GAME_NOT_PRESENT:
          response = await this.generateErrorMessageGame();
          break;

        case this.ERR_CODE_USER_INVOKE:
          response = this.generateErrorUserInvoke();
          break;
      }

      // send message
      this.message.channel.send(response)
    }

    async generateErrorMessageGame() {
      let message = 'Le jeu que vous avez choisis n\'est pas présent dans ma liste \n';
      message += 'Voici la liste des jeux disponible : \n';
      
      let gameFromDb = await this.games.getAllGames();

      gameFromDb.forEach(g => {
        message += `** - ${g.name} (${g.abbrv}) ** \n`;
      });

      return message;
    }

    generateErrorUserInvoke() {
      let message = `${this.message.author}, vous n'avez pas encore le droit d'invoquer la **'Last Des Bros'**. \n`;
      message += "**Info : **Le délai entre chaque 'invoke' est de 12 heures";

      return message;
    }
  }