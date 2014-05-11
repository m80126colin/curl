var SEMA_LIMIT	= 1,
	NEWS_LIMIT	= 356,
	START		= parseInt(process.argv[2]),
	FILE		= process.argv[3],
	PARTITION	= parseInt(process.argv[4]);

var fs			= require('fs'),
	request		= require('request'),
	cheerio		= require('cheerio'),
	url			= 'http://www.ettoday.net/news/0/',
	sema		= SEMA_LIMIT,
	count		= START,
	flag		= 0,
	visited		= new Array(NEWS_LIMIT + 1),
	record		= new Array(NEWS_LIMIT + 1);

for (var i = 0; i <= NEWS_LIMIT; i++)
	visited[i] = 0;

var _req	= function() {
	if (count <= NEWS_LIMIT) {
		sema--;
		var i		= count;
		var tmp		= url + i + '.htm';
		// console.log('Try:', tmp);
		count += PARTITION;
		request.get(tmp, function (e, res, body) {
			var $	= cheerio.load(body);
			console.log('Reach:', i);
			visited[i]	= 1;
			record[i]	= {
				'id':		i,
				'valid':	$('article').length
			};
			sema++;
			if (sema > 0) _req();
		});
	}
	else _final();
}

var _final	= function() {
	console.log('sema =', sema);
	if (sema == SEMA_LIMIT && flag == 0) {
		flag = 1;
		var result = [];
		console.log('Complete Scan.');
		for (var i = START; i <= NEWS_LIMIT; i += PARTITION) {
			if (visited[i] == 0)
				console.log('News', i, 'unload.');
			else if (record[i].valid)
				result.push(record[i].id);
		}
		fs.writeFile(FILE, JSON.stringify(result),
			function (e) {
				if (e) throw e;
		});
	}
}

while (sema) _req();