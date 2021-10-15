module.exports =
  class PlayerCommand
  {
    BASE = '&player';

    constructor(bros)
    {
      this.bros = bros;
    }

    async handleMessage(message)
    {
      this.message = message;

      let bros = await this.bros.getLastPlayers();

      if (bros == undefined)
      {
        this.sendListBrosEmpty();
        return;
      }

      this.sendListBrosResponse(bros);
    }

    sendListBrosResponse(bros)
    {
      
      let response = `Voici les bros : `;
      bros.forEach(el => {
        response += `${el} `;  
      });
      
      this.message.channel.send(response);
    }

    sendListBrosEmpty()
    {
      let response = `Merci de sélectionner les bros (& bros player_list)`;
      this.message.channel.send(response);
    }
  }