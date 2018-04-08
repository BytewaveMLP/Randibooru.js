/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Gets the current guild and member counts.
 *
 * @param {CommandoClient} client - The Discord.JS-Commando Client object
 * @returns {object} - An object containing two properties, guilds and members, each representing the associated counts.
 */
exports.getGuildsAndMembers = client => {
	return client.guilds.reduce((acc, guild) => {
		acc.guilds  += 1;
		acc.members += guild.members.array().length;
		return acc;
	}, {
		guilds:  0,
		members: 0,
	});
};

exports.setGame = client => {
	let { guilds, members } = this.getGuildsAndMembers(client);
	client.user.setGame(`${client.commandPrefix || client.options.commandPrefix}help | Serving ${members} members across ${guilds} guilds`);
};
