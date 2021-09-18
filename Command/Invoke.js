module.exports =
class Invoke
{
  BASE = '&invoke';
  LISTOFGAME = ['Rocket league', 'League of legends','R6','VALORANT', 'CSGO'];
  ERR_CODE_GAME_NOT_PRESENT = 0;
  ERR_CODE_USER_INVOKE = 1;

  constructor(users)
  {
    this.users = users;
  }

  handleMessage(message)
  {
    this.message = message;
    let copyMessage = message.content;
    let gameSelected = copyMessage.slice(this.BASE.length + 1);
    
    this.determineResponse(gameSelected);
  }

  async determineResponse(gameSelected)
  {
    let gameSelectedCopy = gameSelected;

    // Determine if the game is present in the list of games
    let gameIsPresent = this.LISTOFGAME.filter(
      game => game.replace(/\s/g, '').toLowerCase() == gameSelectedCopy.replace(/\s/g, '').toLowerCase()
    );

    if (gameIsPresent == 0)
    {
      this.sendErrorResponse(this.ERR_CODE_GAME_NOT_PRESENT);
      return;
    }

    let user = await this.users.getUsersData(this.message.author.username);

    if (user.length > 0)
    {
      this.sendErrorResponse(this.ERR_CODE_USER_INVOKE);
      return;
    }

    this.users.insertUsersAction(gameSelected, this.message.author.username);
    this.sendSuccessResponse(gameSelected);
  }

  sendSuccessResponse(gameSelected)
  {
    let response = `**LA LAST DES BROS** EST INVOQUÉ PAR ${this.message.author} pour le jeu **${gameSelected}**`;

    // send message
    this.message.channel.send(response)
  }

  sendErrorResponse(errCode)
  {
    let response = '';

    switch (errCode)
    {
      case this.ERR_CODE_GAME_NOT_PRESENT:
        response = this.generateErrorMessageGame();
        break;

      case this.ERR_CODE_USER_INVOKE:
        response = this.generateErrorUserInvoke();
        break;
    }

    // send message
    this.message.channel.send(response)
  }

  generateErrorMessageGame()
  {
    let message = 'Le jeu que vous avez choisis n\'est pas présent dans ma liste \n';
    message += 'Voici la liste des jeux disponible : \n';

    message += `** ${this.LISTOFGAME.join()} **`;

    return message;
  }

  generateErrorUserInvoke()
  {
    let message = `${this.message.author}, vous n'avez pas encore le droit d'invoquer la **'Last Des Bros'**. \n`;
    message += "**Info : **Le délai entre chaque 'invoke' est de 12 heures";

    return message;
  }
}