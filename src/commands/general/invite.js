/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const Helpers = require('../../util/helpers.js');

module.exports = class InviteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['inv'],
			group: 'commands',
			memberName: 'invite',
			description: 'Displays a link to invite the bot to your own Discord server.',
			guarded: true,
		});
	}

	async run(msg) {
		let link = await Helpers.generateInvite(this.client);
		msg.reply(`<${link}>`);
	}
};
