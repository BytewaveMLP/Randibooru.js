# Randibooru.js

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> A Node.js port of [Randibooru](https://github.com/BytewaveMLP/randibooru)

Randibooru.js is my first experiment in Node.js. My goal is to attempt to port Randibooru, my old Python-based Discord bot, to discord.js on Node.

## Table of Contents

- [Install](#install)
    - [Prerequisites](#prerequisites)
	- [Installation](#installation)
- [Usage](#usage)
	- [Commands list](#commands-list)
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

If you don't want to set up Randibooru yourself, feel free to [invite the public version of Randibooru](https://discordapp.com/oauth2/authorize?client_id=206203876095950850&scope=bot&permissions=19456) to a server of your choice. Please do not overload the bot, however, as requests are **logged**. We **will** find you if you mess anything up!

## Usage

### Commands list

- `!rb random [query]` - Get a random image from Derpibooru, optionally matching the given query.
- `!rb top [query]` - Get the top image from Derpibooru, optionally matching the given query.
- `!rb first [query]` - Get the first image uploaded to Derpibooru. You get the point about `[query]` now.
- `!rb latest [query]` - Get the latest image uploaded to Derpibooru.
- `!rb block <user>` - Block the given user from using Randibooru commands in the given server. **REQUIRES MANAGE MESSAGES**
- `!rb unblock <user>` - Allow the given user to use Randibooru commands again in the given server. **REQUIRES MANAGE MESSAGES**

(This also includes the list of built-in Discord.js commands, the likes of which I'm too lazy to list.)

## Maintainers

- [BytewaveMLP](https://github.com/BytewaveMLP)

## Contribute

**Issues, suggestions, or concerns?** Submit a GitHub issue!

**Want to add a feature?** We accept PRs!

## License

Copyright (c) Eliot Partridge, 2016-18. Licensed under [the MPL v2.0](/LICENSE).
