
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
    let diff = Math.floor((date1 - date2 - 110000) / 1000);
    if (diff <= 0) {
      return `posted now`;
    } else if (diff < 60) {
      return `${diff} second(s) ago`;
    } else if (diff < (60 * 60)) {
      return `${Math.floor(diff / 60)} minute(s) ago`;
    } else if (diff < (60 * 60 * 24)) {
      return `${Math.floor(diff / (60 * 60))} hour(s) ago`;
    } else if (diff < (60 * 60 * 24 * 30)) {
      return `${Math.floor(diff / (60 * 60 * 24))} day(s) ago`;
    } else if (diff < (60 * 60 * 24 * 30 * 12)) {
      return `${Math.floor(diff / (60 * 60 * 24 * 30))} month(s) ago`;
    } else {
      return `${Math.floor(diff / (60 * 60 * 24 * 30 * 12))} year(s) ago`;
    }

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
        <p class="posted">${dateDiff(Date.now(), tweet.created_at)}</p>
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
    $('.feed').empty();
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
    let tweetValid = true;
    let tweetText = text.trim();
    $('.error').html('<p></p>');
    $('.error').slideUp("fast");
    if (tweetText === null || tweetText === '') {
      $('.error').slideDown("fast");
      $('.error p').html(`<i class="fas fa-exclamation-triangle"></i> Error: Cannot post blank tweet.`);
      tweetValid = false;
    } else if (tweetText.length > 140) {
      $('.error').slideDown("fast");
      $('.error p').html(`<i class="fas fa-exclamation-triangle"></i> Error: Tweet is too long.`);
      tweetValid = false;
    }

    return tweetValid;
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



