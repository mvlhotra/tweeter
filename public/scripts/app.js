$(document).ready(function() {
  //  escape helper string to prevent tweet code injections
  function escape(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  //  time calculation for each tweet.
  function dateDiff(date1, date2) {
    let diff = Math.floor((date1 - date2) / 1000);
    let unit = '';
    if (diff <= 0) {
      return 'posted now';
    }
    if (diff < 60) {
      unit = 'seconds';
    } else if (diff < 60 * 60) {
      unit = 'minutes';
      diff = Math.floor(diff / 60);
    } else if (diff < 60 * 60 * 24) {
      unit = 'hours';
      diff = Math.floor(diff / (60 * 60));
    } else if (diff < 60 * 60 * 24 * 30) {
      unit = 'days';
      diff = Math.floor(diff / (60 * 60 * 24));
    } else if (diff < 60 * 60 * 24 * 30 * 12) {
      unit = 'months';
      diff = Math.floor(diff / (60 * 60 * 24 * 30));
    } else {
      unit = 'years';
      diff = Math.floor(diff / (60 * 60 * 24 * 30 * 12));
    }
    //  strip the 's' off if tweet was posted 1 second/minute/hour/day/month/year ago.
    if (diff === 1) {
      unit = unit.substr(0, unit.length - 1);
    }
    return `Posted ${diff} ${unit} ago`;
  }

  function createTweet(tweet) {
    const $tweet = `      
    <article class="tweet">
      <header>
        <img src="${tweet.user.avatars.small}">
        <h2>${escape(tweet.user.name)}</h2>
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
          <a href="#"><i class="fas fa-heart"></i></a>
        </div>
      </footer>
    </article>
  `;
    return $tweet;
  }

  function renderTweets(tweets) {
    $('.feed').empty();
    tweets.forEach(tweet => {
      const content = createTweet(tweet);
      $('.feed').prepend(content);
    });
  }
  function loadTweets() {
    $.ajax('/tweets', { method: 'GET' }).then(function(content) {
      renderTweets(content);
    });
  }
  //
  function validateTweet(text) {
    let tweetValid = true;
    const tweetText = text.trim();
    $('.error').html('<p></p>');
    $('.error').slideUp('fast');
    if (tweetText === null || tweetText === '') {
      $('.error').slideDown('fast');
      $('.error p').html(
        `<i class="fas fa-exclamation-triangle"></i> Error: Cannot post blank tweet.`
      );
      tweetValid = false;
    } else if (tweetText.length > 140) {
      $('.error').slideDown('fast');
      $('.error p').html(`<i class="fas fa-exclamation-triangle"></i> Error: Tweet is too long.`);
      tweetValid = false;
    }

    return tweetValid;
  }

  //  once a tweet is submitted, we want to reset the compose tweet elements back to their original values.

  $('.new-tweet form').submit(function() {
    event.preventDefault();
    const valid = validateTweet($('textarea').val());
    if (valid) {
      const content = $('textarea').serialize();
      $.ajax('/tweets', { method: 'POST', data: content }).then(function() {
        loadTweets();
        $('textarea').val('');
        $('.counter').html(140);
      });
    }
  });
  loadTweets();

  //  compose slide toggling
  $('.compose').click(function() {
    $('.container .new-tweet').slideToggle('medium');
    $('textarea').focus();
  });
});
