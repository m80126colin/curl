var fs		= require('fs'),
	request	= require('request'),
	limit	= 1000,
	count	= 0,
	s		= {};

for (var i = 1; i <= limit; i++) {
	var url = 'http://140.115.53.49:8201/api/ettoday/' + i;
	request(url, function (e, res, body) {
		var t = JSON.parse(body);
		if (t.valid) {
			console.log('get:', t.id);
			s[t.id] = t;
		}
		if (++count >= limit) {
			fs.writeFile('result.json', JSON.stringify(s), function (e) { if (e) throw e; });
		}
	});
}