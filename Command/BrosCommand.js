module.exports =
  class BrosCommand
  {
    BASE = '&bros';

    constructor (bros)
    {
      this.bros = bros;
    }
    
    handleMessage(message)
    {
      this.message = message;
      const content = message.content;

      let result = this.cleanContent(content);

      if (result.length == 0)
      {
        this.sendErrorResponse();
        return;
      }

      this.bros.insertBros(result);

      this.sendSuccessResponse();
    }

    cleanContent(content)
    {
      let contentWithoutBase = content.slice(this.BASE.length + 1)
      let contentSplit = contentWithoutBase.split(' ');
      let regex = new RegExp(`^<@![a-z0-9]+>$`);
      
      let brosArray = contentSplit.filter(function(el)
      {
        if (el.search(regex) !== -1)
        {
          return el;
        }
      })

      return brosArray;
    }

    sendErrorResponse()
    {
      let response = 'Merci de donner au moins un **"BROS"** valide !';
      this.message.channel.send(response);
    }

    sendSuccessResponse()
    {
      let response = 'Votre demande a bien été prise en compte !';
      this.message.channel.send(response);
    }
  }