var fetch = require('node-fetch');
var logger = require('../tools/logger');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var seasonid = req.params.seasonid;

    logger.info(`bilibili2RSS seasonid ${seasonid} form origin, IP: ${ip}`);

    // fetch(`https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${uid}`, {
    //     headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36'},
    // }).then(
    //     response => response.json()
    // ).then((data) => {
    //     const list = data.data.vlist;
    //     var rss =
    //     `<?xml version="1.0" encoding="UTF-8"?>
    //     <rss version="2.0">
    //     <channel>
    //     <title>${uid}的bilibili稿件</title>
    //     <link>https://space.bilibili.com/${uid}</link>
    //     <description>${uid}的bilibili稿件，使用 bilibili2RSS(https://github.com/DIYgod/bilibili2RSS) 构建</description>
    //     <language>zh-cn</language>
    //     <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    //     <ttl>300</ttl>`
    //                 for (var i = 0; i < list.length; i++) {
    //                     rss +=`
    //     <item>
    //         <title><![CDATA[${list[i].title}]]></title>
    //         <description><![CDATA[${list[i].description}<br><img src="${list[i].pic}">]]></description>
    //         <pubDate>${new Date(list[i].created * 1000).toUTCString()}</pubDate>
    //         <guid>https://www.bilibili.com/video/av${list[i].aid}</guid>
    //         <link>https://www.bilibili.com/video/av${list[i].aid}</link>
    //     </item>`
    //                 }
    //                 rss += `
    //     </channel>
    //     </rss>`
    //                 res.send(rss);
    //     }
    // ).catch(
    //     e => logger.error("bilibili2RSS Error: getting widget", e)
    // );
};