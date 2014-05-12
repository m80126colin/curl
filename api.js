var express		= require('express'),
	request		= require('request'),
	cheerio		= require('cheerio'),
	host		= 'localhost',
	port		= '8201',
	controller	= {
	ettoday: function(req, res) {
		var id		= req.param('id'),
			url		= 'http://www.ettoday.net/news/0/' + id + '.htm';
		request.get(url, function (e, resp, body) {
			var record;
			if (resp.statusCode == 200) {
				var $		= cheerio.load(body),
					art		= $('article'),
					d		= $('.news-time').text().match(/(\d+)/g),
					tags	= $('#news-keywords strong', art);
				for (var i = 0; i < tags.length; i++)
					tags[i]	= $(tags[i]).text();
				d		= (d.length > 3)?
					(new Date(d[0], d[1] - 1, d[2], d[3], d[4])):
					(new Date(d[0], d[1] - 1, d[2]));
				record	= {
					'valid':	art.length,
					'id':		id,
					'link':		url,
					'media':	'ETtoday',
					'title':	$('header h2', art).text(),
					'time':		d.getTime(),
					'tag':		tags
				};
			}
			else {
				record = {
					'error': resp.statusCode
				};
			}
			res.json(record);
		});
	}
};

express()
.get('/api/ettoday/:id', controller.ettoday)
.listen(host, port);