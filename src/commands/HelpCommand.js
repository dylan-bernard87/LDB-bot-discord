import  { EmbedBuilder, Message } from 'discord.js';

export default class HelpCommand {

	BASE = '&help';
    DESCRIPTION = 'Print this !';
    EXAMPLE = '&help';

    /**
     * All commands used by the Bot
     *
     * @property {Array<{}>}
     */
    commands

    /**
     * @param {Array<{}>} commands
     */
    bindCommands(commands) {
        this.commands = commands;
    }

    /**
     * Print help
     *
     * @param {Message} message
     */
	async run(message) {
        let messageEmbed = new EmbedBuilder()
            .setColor(0x0091ff)
            .setTitle('LDB Bot help');

        this.commands.forEach(com => {
            let comValue = com.DESCRIPTION;
            comValue += `\n *Exemple : * ${com.EXAMPLE}`;

            messageEmbed.addFields({
                name: com.BASE,
                value: comValue,
                inline: false
            });
        });

		message.channel.send({ embeds: [messageEmbed] });
	}
}
