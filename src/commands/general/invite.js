/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class InviteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['inv'],
			group: 'commands',
			memberName: 'invite',
			description: 'Displays a link to invite me to your own Discord server.',
			guarded: true,
		});
	}

	async run(msg) {
		let link = await this.client.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']);

		msg.reply(`<${link}>`);
	}
};
