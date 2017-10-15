/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const handler = require('../../util/derpi-command.js');

module.exports = class TopCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'top',
			aliases: ['t'],
			group: 'derpi',
			memberName: 'top',
			description: 'Gets the top-scoring image from Derpibooru matching the given query - uses Derpibooru\'s syntax (https://derpibooru.org/search/syntax)',
			examples: ['top', 'top safe', 'top safe, -anthro, (this OR that)'],
			args: [
				{
					key: 'query',
					label: 'query',
					default: '',
					prompt: '',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		handler.handleDerpiCommand({
			sortFormat: 'score'
		}, this.client, msg, args);
	}
};