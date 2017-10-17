/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const config = require('../config');

const client = new Commando.Client(config.bot);

client.config = config;

client.registry
	.registerGroups([
		['derpi', 'Derpibooru'],
		['admin', 'Administrative']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
	sqlite.open(path.join(path.dirname(__dirname), 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Initialized - logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
		client.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES'])
			.then(link => {
				console.log(`Use this link to invite me to your server: ${link}`);
			});
		client.user.setGame(`${client.commandPrefix || client.options.commandPrefix}help for help`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('guildCreate', (guild) => {
		console.log(`Joined server ${guild.name} (${guild.id})`);
		let channels = guild.channels.filter((channel) => {
			return channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES');
		});
		if (channels.array().length > 0) {
			channels = channels.sort((a, b) => {
				return a.calculatedPosition - b.calculatedPosition;
			}).array();
			console.log('Posting join message in highest channel with SEND_MESSAGES permission...');
			channels[0].send(`**Hey there!** I'm **Randibooru.js**, the next generation of Randibooru! I fetch random images from Derpibooru, the MLP image booru, for your enjoyment.
			
			If you'd like to know what I can do, take a look at the \`${guild.commandPrefix || client.commandPrefix || client.options.commandPrefix}help\` command!
			
			**Want to see my source code?** Here ya go!
			https://github.com/BytewaveMLP/Randibooru.js
			
			**Join my Discord server!**
			${config.bot.invite}`).catch(console.error); 
		}
	})
	.on('guildDelete', (guild) => {
		console.log(`Removed from server ${guild.name} (${guild.id})`);
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(`Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
		if (!guild) {
			client.user.setGame(`${client.commandPrefix || client.options.commandPrefix}help for help`);
		}
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(`Command ${command.groupID}:${command.memberName} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(`Group ${group.id} ${enabled ? 'enabled' : 'disabled'} ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.`);
	});

client.login(config.auth.discordToken);