const https = require('https');

/**
 * Queries Derpibooru for images matching the given criteria 
 * 
 * @param {object} options - The set of options to use
 * @param {string} [options.apiKey] - Your Derpibooru API key
 * @param {string} [query="*"] - The query to send to Derpibooru
 * @param {string} [sortFormat="created_at"] - The sort format to order the results by
 * @param {string} [order="desc"] - The sort order (asc - ascending/desc - descending) for the result set
 * @param {number} [page=1] - The page of results to fetch
 * @param {function} callback - The callback to run with the result set or errors
 */
function query(options, callback) {
	let {apiKey, query, sortFormat, order, page} = options;

	// If the query is empty, we assume that that means search *everything*
	if (!query) query = '*';
	
	if (!order) order = 'desc';

	if (!sortFormat) sortFormat = 'created_at';

	if (!page) page = 1;

	https.get(`https://derpibooru.org/search.json?page=${page}&sf=${sortFormat}&sd=${order}&q=${encodeURIComponent(query)}${apiKey ? `&key=${apiKey}` : ''}`, (res) => {
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

				callback(null, parsedData);
			} catch (e) {
				// Likely invalid JSON data returned
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