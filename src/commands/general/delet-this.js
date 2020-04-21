/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
 
module.exports = class InfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'deletthis',
			aliases: ['delet', 'deletethis', 'dt', 'delete', 'plsno', 'why', 'd'],
			group: 'commands',
			memberName: 'delet-this',
			description: 'Delete the most recent message sent by the bot, in case it was really bad.',
			details: 'Often times, the bot will find images that are grotesque, weird, or downright confusing. This command will delete the most recent image embed sent by the bot (assuming it\'s recent enough for the bot to find).\nIn future, you might want to ask an admin to change the server-wide filter. See `help filter`.'
		});
	}
 
	async run(msg) {
		const messages = await msg.channel.messages.fetch();
		const myRecentMessages = messages.filter(message => message.author.id === this.client.user.id && message.embeds.length > 0);
		const latestMessage = myRecentMessages.reduce((previous, message) => message.createdAt > previous.createdAt ? message : previous);

		if (msg.channel.type === 'text' && msg.guild.settings.get(`blockedUsers.${msg.author.id}`)) return;

		if (!latestMessage) return msg.reply('Couldn\'t find a recent message to delete! Call an admin instead.');

		return latestMessage.delete();
	}
};
