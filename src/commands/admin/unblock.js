/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class RandomCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'unblock',
			aliases: ['ub'],
			group: 'admin',
			memberName: 'unblock',
			description: 'Unblock a user from using Randibooru in the current server.',
			examples: ['unblock @somedude#1234'],
			args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'Which user should we unblock?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, args) {
		if (!msg.member.hasPermission('KICK_MEMBERS')) {
			return msg.reply('Only users with the **Kick Members** permission may unblock users');
		} else if (args.user.id === msg.author.id) {
			return msg.reply('You can\'t unblock yourself!');
		}
		msg.guild.settings.set(`blockedUsers.${args.user.id}`, false).then(() => {
			return msg.reply(`Unblocked \`${args.user.tag}\``);
		});
	}
};