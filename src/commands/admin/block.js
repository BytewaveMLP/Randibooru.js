/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class RandomCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'block',
			aliases: ['b'],
			group: 'admin',
			memberName: 'block',
			description: 'Block a user from using Randibooru in the current server.',
			examples: ['block @somedude#1234'],
			args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'Which user should we block?',
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
			return msg.reply('You can\'t block yourself!');
		}
		msg.guild.settings.set(`blockedUsers.${args.user.id}`, true).then(() => {
			return msg.reply(`Blocked \`${args.user.tag}\``);
		});
	}
};