/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Discord from 'discord.js';
import * as Commando from 'discord.js-commando';

export class BlockCommand extends Commando.Command {
	constructor(client: Commando.CommandoClient) {
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
				'MANAGE_MESSAGES'
			]
		});
	}

	async run(msg: Commando.CommandMessage, args: { user: Discord.User }) {
		if (args.user.id === msg.author.id) {
			return msg.reply('You can\'t block yourself!');
		}

		await (msg.guild as Commando.GuildExtension).settings.set(`blockedUsers.${args.user.id}`, true);
		return msg.reply(`Unblocked \`${args.user.tag}\``);
	}
};
