/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const handler = require('../../util/derpi-command.js');

module.exports = class FirstCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'first',
			aliases: ['f'],
			group: 'derpi',
			memberName: 'first',
			description: 'Gets the first image uploaded to Derpibooru matching the given query',
			examples: ['first', 'first safe', 'first safe, -anthro, (this OR that)'],
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
			sortFormat: 'created_at',
			order: 'asc'
		}, this.client, msg, args);
	}
};