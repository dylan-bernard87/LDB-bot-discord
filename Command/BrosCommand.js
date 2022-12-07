module.exports =
class BrosCommand {

  BASE = '&bros';
  ERR_CODE_BROS_NOT_DETECTED = 0;
  ERR_CODE_INTERNAL_ERROR = 1;

	constructor (bros) {
		this.bros = bros;
	}

	async handleMessage(message) {
		this.message = message;
		const content = message.content;

		let cleanedContent = this.cleanContent(content);

		if (cleanedContent.length == 0) {
			this.sendErrorResponse(this.ERR_CODE_BROS_NOT_DETECTED);
			return;
		}

		let result = await this.bros.insertBros(cleanedContent, this.message.guild.name);

		if (result == false)	{
			this.sendErrorResponse(this.ERR_CODE_INTERNAL_ERROR);
			return;
		}

		this.sendSuccessResponse();
	}

  cleanContent(content) {
		let contentWithoutBase = content.slice(this.BASE.length + 1);
		let contentSplit = contentWithoutBase.split(' ');
		let regex = new RegExp(`^<@![a-z0-9]+>$`);

		let brosArray = contentSplit.filter(function(el) {
		if (el.search(regex) !== -1)	return el;
		})

		return brosArray;
  }

	sendErrorResponse(errCode) {
		let response = '';

		switch (errCode) {
			case this.ERR_CODE_BROS_NOT_DETECTED:
				response = this.generateBrosNotDetectedErrorMessage();
				break;
			case this.ERR_CODE_INTERNAL_ERROR:
				response = this.generateInternalErrorMessage();
				break;
		}

		// send message
		this.message.channel.send(response);
	}

	generateBrosNotDetectedErrorMessage() {
		let message = 'Merci de donner au moins un **"BROS"** valide !';
		return message;
	}

	generateInternalErrorMessage() {
		let message = '**OOPS une erreur interne est survenue :/**';
		return message;
	}

	sendSuccessResponse() {
		let response = 'Votre demande a bien été prise en compte !';
		this.message.channel.send(response);
	}
}
