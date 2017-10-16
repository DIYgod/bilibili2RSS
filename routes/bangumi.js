var logger = require('../tools/logger');
var request = require('request');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var seasonid = req.params.seasonid;

    logger.info(`bilibili2RSS seasonid ${seasonid}, IP: ${ip}`);

    request.get({
        url: `https://bangumi.bilibili.com/jsonp/seasoninfo/${seasonid}.ver?callback=seasonListCallback&jsonp=jsonp&_=${+new Date()}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
            'Referer': `https://bangumi.bilibili.com/anime/${seasonid}/`,
            'Origin': 'https://bangumi.bilibili.com'
        }
    }, function (err, httpResponse, body) {
        var data;
        try {
            data = JSON.parse(body.match(/^seasonListCallback\((.*)\);$/)[1]);
        }
        catch(e) {
            data = {
                result: {
                    episodes: []
                }
            }
        }
        var result = data.result || {
            episodes: []
        };
        var list = result.episodes;
        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
        <channel>
        <title>${result.title}</title>
        <link>https://bangumi.bilibili.com/anime/${seasonid}/</link>
        <description>${result.evaluate} - 使用 bilibili2RSS(https://github.com/DIYgod/bilibili2RSS) 构建</description>
        <language>zh-cn</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>300</ttl>`
        for (var i = 0; i < list.length; i++) {
            rss += `
        <item>
            <title><![CDATA[第${list[i].index}话 ${list[i].index_title}]]></title>
            <description><![CDATA[更新时间：${list[i].update_time}<img src="${list[i].cover}">]]></description>
            <pubDate>${new Date(list[i].update_time).toUTCString()}</pubDate>
            <guid>${list[i].webplay_url}</guid>
            <link>${list[i].webplay_url}</link>
        </item>`
        }
        rss += `
        </channel>
        </rss>`
        res.send(rss);
    });
};