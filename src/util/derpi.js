const https = require('https');

const defaultQueryOptions = {
	query: '*',
	order: 'desc',
	sortFormat: 'created_at',
	page: 1,
	filter: 56027,
};

/**
 * Queries Derpibooru for images matching the given criteria
 *
 * @param {object} options - The set of options to use
 * @param {string} [options.apiKey] - Your Derpibooru API key
 * @param {string} [options.query="*"] - The query to send to Derpibooru
 * @param {string} [options.sortFormat="created_at"] - The sort format to order the results by
 * @param {string} [options.order="desc"] - The sort order (asc - ascending/desc - descending) for the result set
 * @param {number} [options.page=1] - The page of results to fetch
 * @param {number} [options.filter=56027] - The filter ID to use
 * @param {function} callback - The callback to run with the result set or errors
 */
exports.query = (options, callback) => {
	if (options.query === '') options.query = '*';

	options = Object.assign({}, defaultQueryOptions, options);

	console.debug(options);

	let url = 'https://derpibooru.org/search.json';

	url += `?page=${options.page}`;
	url += `&sf=${options.sortFormat}`;
	url += `&sd=${options.order}`;
	url += `&q=${encodeURIComponent(options.query)}`;
	url += `&filter_id=${options.filter}`;

	if (options.apiKey) {
		url += `&key=${options.apiKey}`;
	}

	https.get(url, (res) => {
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
};
