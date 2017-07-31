const https = require('https');

/**
 * 
 * 
 * @param {object} options 
 * @param {function} callback 
 */
function query(options, callback) {
	let {apiKey, query, sortFormat} = options;

	// If the query is empty, we assume that that means search *everything*
	if (!query) query = '*';

	if (!sortFormat) sortFormat = 'top';

	https.get(`https://derpibooru.org/search.json?sf=${sortFormat}&q=${encodeURIComponent(query)}${apiKey ? `&key=${apiKey}` : ''}`, (res) => {
		const { statusCode } = res;
		if (statusCode !== 200) {
			res.resume();
			callback(new Error(`Request failed - status: ${statusCode}`));
			return;
		}

		res.setEncoding('utf8');
		
		let rawData = '';

		res.on('data', (chunk) => { rawData += chunk; });

		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				const results = parsedData.search;

				if (results.length === 0) {
					// No results, so pass nothing
					// TODO: Pass null, null instead?
					callback();
				} else {
					callback(null, results[Math.floor(Math.random() * results.length)]);
				}
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