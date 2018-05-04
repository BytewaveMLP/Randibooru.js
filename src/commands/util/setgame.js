/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');

module.exports = class AnnounceCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'setgame',
			aliases: ['sg'],
			group: 'util',
			memberName: 'setgame',
			description: 'Sets the bot\'s game status. Without any arguments, this restores the default status. With arguments, it sets the in-game status to something custom.',
			details: 'Only the bot owner may use this command.',
			examples: ['setgame', 'setgame "Game Name"', 'setgame "Game Name" LISTENING'],
			guarded: true,
			args: [
				{
					key: 'game',
					label: 'game',
					default: '',
					prompt: '',
					type: 'string'
				},
				{
					key: 'type',
					label: 'type',
					default: 'PLAYING',
					prompt: '',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		let type;

		if (args.game === '') {
			Helpers.setGame(this.client);
		} else {
			type = args.type.toUpperCase();
			await this.client.user.setPresence({
				game: {
					name: args.game,
					type: type
				}
			});
		}

		return msg.reply(`Changed in-game status to ${args.game !== '' ? `\`${args.game}\` with type \`${type}\`` : 'the default'}.`);
	}
};
