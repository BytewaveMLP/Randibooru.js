/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');

module.exports = class AnnounceCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'updategame',
			aliases: ['ug'],
			group: 'util',
			memberName: 'updategame',
			description: 'Update the bot\'s game status.',
			details: 'Only the bot owner may use this command.',
			examples: ['updategame'],
			guarded: true,
			args: [
				{
					key: 'game',
					label: 'game',
					default: '',
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
		if (args.game === '') {
			Helpers.setGame(this.client);
		} else {
			await this.client.user.setGame(args.game);
		}

		return msg.reply(`Changed in-game status to ${args.game !== '' ? `\`${args.game}\`` : 'the default'}.`);
	}
};
