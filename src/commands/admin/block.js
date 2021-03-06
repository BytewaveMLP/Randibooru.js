/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class BlockCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			guildOnly: true,
			name: 'block',
			aliases: ['b'],
			group: 'admin',
			memberName: 'block',
			description: 'Block a user from using Randibooru in the current server.',
			details: 'Prevents the bot from responding to any Derpibooru-related commands issued by the given user. Unblock the user with the matching `unblock` command.',
			examples: ['block @somedude#1234'],
			args: [
				{
					key: 'user',
					label: 'user',
					prompt: 'Which user should be blocked?',
					type: 'user'
				}
			],
			userPermissions: [
				'MANAGE_MESSAGES',
			],
		});
	}

	async run(msg, args) {
		if (args.user.id === msg.author.id) {
			return msg.reply('You can\'t block yourself!');
		}

		await msg.guild.settings.set(`blockedUsers.${args.user.id}`, true);
		return msg.reply(`Unblocked \`${args.user.tag}\``);
	}
};
