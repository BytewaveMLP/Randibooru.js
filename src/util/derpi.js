const https = require('https');

function query(sf, query, callback) {
	https.get('https://derpibooru.org/search.json?sf=random&q=' + encodeURIComponent(query), (res) => {
		const { statusCode } = res;
		if (statusCode !== 200) {
			res.resume();
			callback(new Error(`Request failed - status: ${statusCode}`));
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				const results = parsedData.search;
				if (results.length === 0) {
					callback();
				}
				callback(null, results[Math.floor(Math.random() * results.length)]);
			} catch (e) {
				callback(e);
			}
		});
	}).on('error', (e) => {
		callback(e);
	});
}

module.exports = {
	query: query
};