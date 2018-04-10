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
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg) {
		await Helpers.setGame(this.client);
		return msg.reply('Updated successfully.');
	}
};
