
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function () {

  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const dateDiff = function calculateDateDifference(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return -1 * Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));

  }
  const crTweet = function createTweetElement(tweet) {

    let $tweet = `      
    <article class="tweet">
      <header>
        <img src="${tweet.user.avatars.small}">
        <h1>${escape(tweet.user.name)}</h1>
        <p class="handle">${escape(tweet.user.handle)}</p>
      </header>
      <div class="content">
        <p class="tweet-content">${escape(tweet.content.text)}</p>
      </div>
      <footer>
        <p class="posted">${dateDiff(Date.now(), tweet.created_at)} days ago</p>
        <div class="icons">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `
    return $tweet;

  };

  function renderTweets(tweets) {
    tweets.forEach(tweet => {
      let content = crTweet(tweet);
      $('.feed').prepend(content);
    });
    return;
  }
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (content) {
        renderTweets(content);
      });
    return;
  };

  function validateTweet(text) {
    let tweetText = text.trim();
    if (tweetText === null || tweetText === '') {
      alert("Cannot post blank tweet.");
      return false;
    } else if (tweetText.length > 140) {
      alert("Tweet is too long.");
      return false;
    }
    return true;
  }


  $('.new-tweet form').submit(function () {
    event.preventDefault();
    let valid = validateTweet($('textarea').val());
    if (valid) {
      let content = $('textarea').serialize();
      $.ajax('/tweets', { method: 'POST', data: content })
        .then(function () {
          loadTweets();
          $('textarea').val("");
          $('.counter').html(140);
        });
    }
  });
  loadTweets();

  $('.compose').click(function () {
    $('.container .new-tweet').slideToggle("medium");
    $('textarea').focus();
  });

});

