/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');

module.exports = class AnnounceCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'announce',
			aliases: ['an'],
			group: 'util',
			memberName: 'announce',
			description: 'Announce something to the topmost channel in all servers the bot is in.',
			details: 'Only the bot owner may use this command.',
			examples: ['announce Hello, world!'],
			args: [
				{
					key: 'msg',
					label: 'message',
					prompt: 'What should be announced?',
					type: 'string'
				}
			],
			guarded: true,
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		this.client.guilds.array().forEach((guild) => {
			let channels = guild.channels.filter((channel) => {
				return channel.type === 'text' && channel.permissionsFor(guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES']);
			});
			if (channels.array().length > 0) {
				channels = channels.sort((a, b) => {
					return a.calculatedPosition - b.calculatedPosition;
				}).array();
				channels[0].send(args.msg).catch(e => console.error(e));
			}
		});
	}
};
