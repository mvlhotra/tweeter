$(document).ready(function() {
  const text = document.querySelector('.new-tweet textarea');
  text.addEventListener('input', function() {
    const len = this.value.length;
    const count = $(this).siblings('.counter');
    count[0].innerText = 140 - len;
    if (count[0].innerText < 0) {
      $(count).addClass('negative');
    } else {
      $(count).removeClass('negative');
    }
  });
});
