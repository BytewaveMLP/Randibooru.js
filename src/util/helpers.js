/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Gets the current guild and UNIQUE member counts.
 *
 * @param {CommandoClient} client - The Discord.JS-Commando Client object
 * @returns {object} - An object containing two properties, guilds and members, each representing the associated counts.
 */
exports.getGuildsAndMembers = client => {
	// Algorithm provided by CyberPon3
	// https://github.com/CyberPon3
	let members = client.guilds.reduce(
		(acc, guild) => {
			guild.members
				.filter(member => !member.user.bot)
				.forEach(member => acc.add(member.id));

			return acc;
		},
		new Set()
	).size;

	let guilds = client.guilds.array().length;

	return { members: members, guilds: guilds };
};

exports.setGame = client => {
	let { members, guilds } = this.getGuildsAndMembers(client);
	client.user.setGame(`${client.commandPrefix || client.options.commandPrefix}help | ${members} members across ${guilds} guilds`);
};
