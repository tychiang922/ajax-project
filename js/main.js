var apikey = '1113234349f9424cb830c124095055c8';
var $modal = document.querySelector('.modal');
var $search = document.querySelector('.search');
function searchSubmit(event) {
  if (event.key === 'Enter' || event.type === 'blur') {
    if ($search.value === '') {
      $modal.setAttribute('class', 'modal hidden');
      $search.blur();
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.twelvedata.com/quote?symbol=' + $search.value + '&apikey=' + apikey);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
    });
    xhr.send();
    $search.blur();
    $modal.setAttribute('class', 'modal hidden');
  }
}

$search.addEventListener('blur', searchSubmit);
$search.addEventListener('keydown', searchSubmit);
$search.addEventListener('focus', function modalBox(event) {
  $modal.setAttribute('class', 'modal');
});
