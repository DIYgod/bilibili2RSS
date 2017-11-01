var logger = require('../tools/logger');
var request = require('request');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    var tid = req.params.tid;

            request.post({
                url: `https://api.bilibili.com/archive_rank/getarchiverankbypartion?tid=${tid}&pn=1`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36'
                }
            }, function (err, httpResponse, body) {
                //console.log(JSON.parse(body));
                            const data = JSON.parse(body);
                            const list = data.data.archives || [];
        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
        <channel>
        <title>连载动画</title>
        <link>https://www.bilibili.com/video/bangumi-two-1.html</link>
        <description>使用 bilibili2RSS(https://github.com/DIYgod/bilibili2RSS) 构建</description>
        <language>zh-cn</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>300</ttl>`
        for (var i = 0; i < list.length; i++) {
            rss += `
        <item>
            <title><![CDATA[${list[i].title}]]></title>
            <description>${list[i].description}</description>
            <pubDate>${new Date(list[i].create).toUTCString()}</pubDate>
            <guid>https://www.bilibili.com/video/av${list[i].aid}</guid>
            <link>https://www.bilibili.com/video/av${list[i].aid}</link>
        </item>`
        }
        rss += `
        </channel>
        </rss>`

            res.send(rss);

            });
 
};