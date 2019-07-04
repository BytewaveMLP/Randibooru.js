/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const handler = require('../../util/derpi-command.js');

module.exports = class RandomCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'random',
			aliases: ['rand', 'r'],
			group: 'derpi',
			memberName: 'random',
			description: 'Gets a random image from Derpibooru matching the given query - uses Derpibooru\'s syntax (<https://derpibooru.org/search/syntax>)',
			examples: ['random', 'random safe', 'random safe, -anthro, (this OR that)'],
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
			sortFormat: 'random'
		}, this.client, msg, args);
	}
};
