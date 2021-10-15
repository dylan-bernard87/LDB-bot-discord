module.exports =
  class HelpCommand
  {
    BASE = '&help';
    COMMANDS = ['&help', '&players', '&bros list_of_player', '&invoke game_selected']
    
    handleResponse(message)
    {
      let response = 'Voici la liste des commandes disponible :';

      this.COMMANDS.forEach(el => {
        response += `\n **${el}**`;
      })

      // send message
      message.channel.send(response);
    }
  }