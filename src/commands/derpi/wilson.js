/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const handler = require('../../util/derpi-command.js');

module.exports = class TopCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'wilson',
			aliases: ['w', 'ws'],
			group: 'derpi',
			memberName: 'wilson',
			description: 'Gets the image with the highest Wilson score from Derpibooru matching the given query',
			details: 'Uses complicated math to find the "best" image matching your query, not just the image with the highest score.\nDerpibooru\'s search syntax: <https://derpibooru.org/search/syntax>',
			examples: ['wilson', 'wilson safe', 'wilson safe, -anthro, (this OR that)'],
			args: [
				{
					key: 'query',
					label: 'query',
					default: '',
					prompt: '',
					type: 'string'
				}
			],
		});
	}

	async run(msg, args) {
		return handler.handleDerpiCommand({
			sortFormat: 'wilson'
		}, this.client, msg, args);
	}
};
