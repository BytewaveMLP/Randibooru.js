# Randibooru.js

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme) [![Discord Bots](https://discordbots.org/api/widget/status/206204053653291009.svg)](https://discordbots.org/bot/206204053653291009)

> A Node.js port of [Randibooru](https://github.com/BytewaveMLP/randibooru)

Randibooru is a simple bot which allows users to fetch images from the [Derpibooru](https://derpibooru.org) MLP:FIM image board.

Randibooru.js is my first experiment in Node.js. My goal is to attempt to port Randibooru, my old Python-based Discord bot, to discord.js on Node.

## Table of Contents

- [Install](#install)
    - [Prerequisites](#prerequisites)
	- [Installation](#installation)
- [Usage](#usage)
	- [Users](#users)
		- [Commands](#commands)
	- [Moderators/Server Owners](#moderatorsserver-owners)
		- [Filters](#filters)
		- [Blocking](#blocking)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

### Prerequisites

- Node.js (tested on v8.2.1)

### Installation

```bash
$ npm install # Install all dependencies
$ cp config.example.json config.json # Create a local config
$ $EDITOR config.json # Add your config options here
### NOTE: We assume your derpiAPIKey points to an account with the Everything filter set. If not, the bot will still work, but replies may be incorrect in terms of the amount of images matching a given query.
$ node . # Run the bot
```

If you don't want to set up Randibooru yourself, feel free to [invite the public version of Randibooru](https://discordapp.com/oauth2/authorize?client_id=206203876095950850&scope=bot&permissions=19456) to a server of your choice.

[![Discord Bots](https://discordbots.org/api/widget/206204053653291009.svg)](https://discordbots.org/bot/206204053653291009)

## Usage

Information about the bot can be found by using the `help` and `info` commands. All commands should be prefixed with `!rb` or a mention to the bot. A brief summary of some of the features may be found below.

### Users

While the name implies randomness, Randi has evolved beyond simple random image fetching. Currently, Randibooru supports 4 Derpibooru image-fetching commands:

#### Commands

- `first`: Fetches the first image uploaded to Derpibooru matching the given query
- `latest`: Fetches the most recent image uploaded to Derpibooru matching the query
- `random`: Fetches a random image matching the given query
- `top`: Fetches the highest-rated image matching the given query

All queries are passed directly to Derpibooru, and use their [search syntax](https://derpibooru.org/search/syntax). Replies are sent as a **rich embed**, which requires link previews to be enabled both in the server settings and on your client.

Commands may be run in servers, or in a DM. In servers, NSFW images will only be sent to channels marked NSFW, and in DMs the NSFW filter is always used.

For users, this is all you need to know. However...

### Moderators/Server Owners

Randibooru is configuarable! If you don't like the way she operates, you're free to mess with her settings to your heart's content.

#### Filters

Filters are a way to limit the tags users can find images matching. These are another Derpibooru feature which have been directly implemented into the bot. To change the default filters, use the `filter` command.

The structure for the `filter` command is: `filter <key> [<type>]`, where `key` is the numeric ID for the filter (a list of default filters can be obtained [here](https://derpibooru.org/filters)), which can be found after `/filters/` in the URL bar, and `type` is either `SFW` or `NSFW` to denote which filter you want to set.

The `SFW` filter will be used in most channels. By default, this is set to Derpibooru's [Default](https://derpibooru.org/filters/100073) filter, which is suitable for most servers. It hides "non-art" content, and anything that would be considered explicit.

The `NSFW` filter will be used in NSFW-marked channels. By default, this is set to Derpibooru's [Everything](https://derpibooru.org/filters/56027) filter, which may be a little extreme for some servers. It is recommended that you choose a more suitable filter for this by default, or optionally create your own if none of the defaults are to your needs.

Filters may only be set by the users with the `Manage Channels` permission.

#### Blocking

You can block problematic users by using the `block` command. This prevents the bot from acknowledging any Derpibooru image requests, and can be useful for people that spam obscene images. This was mostly useful before filters were implemented, but may still prove useful if someone is overusing the bot.

To unblock a user, use the `unblock` command.

Blocks may only be put in place by users with the `Manage Messages` permission.

## Maintainers

- [BytewaveMLP](https://github.com/BytewaveMLP)

## Contribute

**Issues, suggestions, or concerns?** Submit a GitHub issue!

**Want to add a feature?** We accept PRs!

## License

Copyright (c) Eliot Partridge, 2016-18. Licensed under [the MPL v2.0](/LICENSE).
