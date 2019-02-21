// Simulates the kind of delay we see with network or filesystem operations
// Defines helper functions for saving and getting tweets, using the database `db`

module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet, err => {
        if (err) {
          return callback(err);
        }
        callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection('tweets')
        .find()
        .toArray((err, tweets) => {
          if (err) {
            return callback(err);
          }
          callback(null, tweets.sort(sortNewestFirst));
        });
    }
  };
};
