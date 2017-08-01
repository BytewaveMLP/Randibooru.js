const derpi = require('./derpi.js');
const embed = require('./embed.js');

/**
 * Handles an incoming Derpibooru-related command.
 * 
 * @param {string} [sortFormat="created_at"] - The sort format to pull a random result from
 * @param {object} client - The Discord.js client object (this.client in command context)
 * @param {object} msg - The Discord.js message object (first param in async run)
 * @param {object} args - The arguments to the command (second param in async run)
 */
exports.handleDerpiCommand = (sortFormat, client, msg, args) => {
	if (msg.channel.type === 'text' && msg.guild.settings.get('blockedUsers.${msg.author.id}')) {
		return;
	}
	
	let query = args.query;

	// Only NSFW channels can have explicit content
	// (Assumes DMs are fine)
	const nsfw = msg.channel.type === 'dm' || msg.channel.nsfw;

	msg.channel.startTyping();

	derpi.query({
		apiKey: nsfw ? client.config.auth.derpiAPIKey : '',
		query: query,
		sortFormat: sortFormat
	}, (err, data) => {
		// Sometimes, the typing indicator gets stuck, so let's reset it here
		msg.channel.stopTyping();

		if (err) {
			return msg.reply(`An error occurred: ${err.message}`);
		}

		let results = data.search;
		let result;

		if (results.length > 0) {
			result = results[Math.floor(Math.random() * results.length)];
		}

		if (result === undefined) {
			return msg.reply(`No ${!nsfw ? 'safe-for-work ' : '' }images found for query: \`${args.query}\``);
		}

		let reply = embed.derpibooruResultToEmbed(result);

		return msg.reply(args.query !== '' ? `query: \`${args.query}\`` : '', reply);
	});
};