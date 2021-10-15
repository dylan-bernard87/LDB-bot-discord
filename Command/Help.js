module.exports =
  class Help {
    BASE = '&help';
    COMMANDS = ['&help', '&bros', '&bros list_of_player', '&invoke game_selected']
    
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