/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');
 
module.exports = class InfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'deletthis',
			aliases: ['delet', 'deletethis', 'dt', 'delete', 'plsno', 'why'],
			group: 'commands',
			memberName: 'delet-this',
			description: 'Delete the most recent message sent by the bot, in case it was really bad. In future, you might want to use the `filter` command to change the server-wide filter. See `help filter`.',
		});
	}
 
	async run(msg) {
		const messages = msg.channel.messages.size > 20 ? msg.channel.messages : await msg.channel.fetchMessages();
		const myRecentMessages = messages.filter(message => message.author.id === this.client.user.id && message.embeds.length > 0);
		const latestMessage = myRecentMessages.reduce((previous, message) => message.createdAt > previous.createdAt ? message : previous);

		if (msg.channel.type === 'text' && msg.guild.settings.get(`blockedUsers.${msg.author.id}`)) return;

		if (!latestMessage) return msg.reply('Couldn\'t find a recent message to delete! Call an admin instead.');

		return latestMessage.delete();
	}
};
