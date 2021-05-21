const twitter = require("twitter");

const client = new twitter({
  consumer_key: QveQ4IHMZiFov6mf0THMc9Kym,
  consumer_secret: WS90kPvUGLUQWKHGGpG0QhdGSmbu4S60JXekFHtzm3rPJ0YIWY,
  access_token_key: 1270511963466940417-oteMGSwNhsSFEUNr2JpIOlFvjf6nrB,
  access_token_secret: eDVfEuyxyGYOAcKWLjxWZhiQnxQwFwmiDXvDd2iEVMj5N,
});

exports.handler = async (event) => {
  const params = { screen_name: event.queryStringParameters.name, count: 180 };
  if (event.queryStringParameters.maxid) {
    params.max_id = Number(event.queryStringParameters.maxid);
  }
  const tweets = await getTweets(params);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET",
    },
    body: JSON.stringify(tweets),
  };
};

const getTweets = function (params) {
  return new Promise((resolve, reject) => {
    client.get("favorites/list", params, function (error, tweets, response) {
      if (!error) {
        resolve(extractData(tweets));
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
};

const extractData = function (tweets) {
  var images = { url: [], source: [], height: [], max_id: 0 };
  tweets.forEach((tweet) => {
    if (tweet.entities.media) {
      if (tweet.entities.media[0].type == "photo") {
        if (!tweet.entities.media[0].media_url_https.includes("video_thumb")) {
          images.url.push(tweet.entities.media[0].media_url_https);
          images.source.push(tweet.entities.media[0].expanded_url);
          const w = tweet.entities.media[0].sizes.medium.w;
          const h = tweet.entities.media[0].sizes.medium.h;
          images.height.push(h / w);
        }
      }
    }
  });
  const max_id = tweets[tweets.length - 1].id - 10000;
  images.max_id = max_id;
  return images;
};