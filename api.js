var express		= require('express'),
	request		= require('request'),
	cheerio		= require('cheerio'),
	host		= 'localhost',
	port		= '8201';
var controller	= {
	ettoday: function(req, res) {
		var id		= req.param('id'),
			url		= 'http://www.ettoday.net/news/0/' + id + '.htm';
		request.get(url, function (e, resp, body) {
			var record = {};
			if (resp.statusCode == 200) {
				var $			= cheerio.load(body);
				record.valid	= $('article').length;
				if (record.valid) {
					var art		= $('article'),
						d		= $('.news-time').text()
									.match(/(\d+)/g),
						r_tag	= $('#news-keywords strong', art),
						tags	= [],
						date	= '';
					for (var i = 0; i < r_tag.length; i++)
						tags.push($(r_tag[i]).text());
					date	= (d.length > 3)?
						(new Date(d[0], d[1] - 1, d[2], d[3], d[4])):
						(new Date(d[0], d[1] - 1, d[2]));
					record.id		= id;
					record.link		= resp.request.href;
					record.media	= 'ETtoday',
					record.author	= '',
					record.site		= '',
					record.content	= $('sectione>p', art).text(),
					record.title	= $('header h2', art).text();
					record.time		= date.getTime();
					record.tag		= tags;
				}
			}
			else {
				record.error	= resp.statusCode;
			}
			res.json(record);
		});
	}
};

express()
.use(express.bodyParser())
.get('/api/ettoday/:id', controller.ettoday)
.listen(port, host);