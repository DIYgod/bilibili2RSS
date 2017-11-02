var logger = require('../tools/logger');
var request = require('request');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    var tid = req.params.tid;

            request.post({
                url: `https://api.bilibili.com/archive_rank/getarchiverankbypartion?tid=${tid}&pn=1`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
                    'Referer': `https://www.bilibili.com`,
                    'Origin': 'https://www.bilibili.com'
                }
            }, function (err, httpResponse, body) {
                const data = JSON.parse(body);
                const list = data.data.archives || [];
                let name = '未知';
                if (list[0] && list[0].tname) {
                    name = list[0].tname;
                }
        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
        <channel>
        <title>bilibili ${name}分区</title>
        <link>https://www.bilibili.com</link>
        <description>bilibili ${name} 分区 - 使用 bilibili2RSS(https://github.com/DIYgod/bilibili2RSS) 构建</description>
        <language>zh-cn</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>300</ttl>`
        for (var i = 0; i < list.length; i++) {
            rss += `
        <item>
            <title><![CDATA[${list[i].title} - ${list[i].author}]]></title>
            <description><![CDATA[${list[i].description}<img src="${list[i].pic}">]]></description>
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