/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class UnblockCommand extends Commando.Command {
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
			],
			userPermissions: [
				'MANAGE_MESSAGES',
			]
		});
	}

	async run(msg, args) {
		if (args.user.id === msg.author.id) {
			return msg.reply('You can\'t unblock yourself!');
		}

		await msg.guild.settings.remove(`blockedUsers.${args.user.id}`);
		return msg.reply(`Unblocked \`${args.user.tag}\``);
	}
};
