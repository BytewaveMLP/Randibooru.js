const derpi = require('./derpi.js');
const embed = require('./embed.js');

/**
 * Handles an incoming Derpibooru-related command.
 * 
 * @param {object} options - The options to pass to Derpibooru
 * @param {string} [options.sortFormat] - The sort format to pull a result from
 * @param {string} [options.order] - The order to sort the results in before retrieving one
 * @param {object} client - The Discord.js client object (this.client in command context)
 * @param {object} msg - The Discord.js message object (first param in async run)
 * @param {object} args - The arguments to the command (second param in async run)
 */
exports.handleDerpiCommand = (options, client, msg, args) => {
	if (msg.channel.type === 'text' && msg.guild.settings.get('blockedUsers.${msg.author.id}')) {
		return;
	}

	msg.channel.startTyping();
	
	options.query = args.query;

	// Only NSFW channels can have explicit content
	// (Assumes DMs are fine)
	const nsfw = msg.channel.type === 'dm' || msg.channel.nsfw;

	options.apiKey = nsfw ? client.config.auth.derpiAPIKey : '';

	derpi.query(options, (err, data) => {
		// Sometimes, the typing indicator gets stuck, so let's reset it here
		msg.channel.stopTyping();

		if (err) {
			return msg.reply(`An error occurred: ${err.message}`);
		}

		let results = data.search;
		let result;

		if (results.length > 0) {
			result = results[options.sortFormat === 'random' ? Math.floor(Math.random() * results.length) : 0];
		}

		if (result === undefined) {
			return msg.reply(`No ${!nsfw ? 'safe-for-work ' : '' }images found for query: \`${args.query}\``);
		}

		let reply = embed.derpibooruResultToEmbed(result);

		return msg.reply(args.query !== '' ? `query: \`${args.query}\`` : '', reply);
	});
};