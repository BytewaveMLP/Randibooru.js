const Discord = require('discord.js');
const config = require('../config');

const shardManager = new Discord.ShardingManager(__dirname + '/randibooru.js', {
	token: config.auth.discordToken
});

shardManager.on('launch', shard => {
	console.log(`Spawned shard ${shard.id}`);
});

shardManager.spawn();
