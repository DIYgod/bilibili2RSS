var logger = require('../tools/logger');
var redis = require('../tools/redis');
var request = require('request');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var name;

    var uid = req.params.uid;

    redis.client.get(`bilibiliuid${uid}`, function (err, reply) {
        if (reply) {
            logger.info(`bilibiliuid${uid} form redis, IP: ${ip}`);
            name = reply;
            getVideos();
        }
        else {
            logger.info(`bilibiliuid${uid} form origin, IP: ${ip}`);
            request.post({
                url: 'https://space.bilibili.com/ajax/member/GetInfo',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
                    'Referer': `https://space.bilibili.com/${uid}/`,
                    'Origin': 'https://space.bilibili.com'
                },
                form: {
                    mid: uid
                }
            }, function (err, httpResponse, body) {
                name = JSON.parse(body).data.name;
                redis.set(`bilibiliuid${uid}`, name);
                getVideos();
            });
        }
    });

    function getVideos () {
        logger.info(`bilibili2RSS uid ${uid}, IP: ${ip}`);

        request.get({
            url: `https://space.bilibili.com/ajax/member/getCoinVideos?mid=${uid}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
                'Referer': `https://space.bilibili.com/${uid}/`,
                'Origin': 'https://space.bilibili.com'
            }
        }, function (err, httpResponse, body) {
            const data = JSON.parse(body);
            const list = data.data.list || [];
            var rss =
                `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
            <channel>
            <title>${name}的bilibili投币视频</title>
            <link>https://space.bilibili.com/${uid}</link>
            <description>${name}的bilibili投币视频，使用 bilibili2RSS(https://github.com/DIYgod/bilibili2RSS) 构建</description>
            <language>zh-cn</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <ttl>300</ttl>`
            for (var i = 0; i < list.length; i++) {
                rss += `
            <item>
                <title><![CDATA[${list[i].title}]]></title>
                <description><![CDATA[${list[i].title}<br><img referrerpolicy="no-referrer" src="${list[i].pic}">]]></description>
                <guid>https://www.bilibili.com/video/av${list[i].stat.aid}</guid>
                <link>https://www.bilibili.com/video/av${list[i].stat.aid}</link>
            </item>`
            }
            rss += `
            </channel>
            </rss>`
            res.send(rss);
        });
    }
};