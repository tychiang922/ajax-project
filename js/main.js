var apikey = '1113234349f9424cb830c124095055c8';
var $search = document.querySelector('.search');
function searchSubmit(event) {
  if (event.key === 'Enter' || event.type === 'blur') {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.twelvedata.com/quote?symbol=' + $search.value + '&apikey=' + apikey);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
    });
    xhr.send();
  }
}

$search.addEventListener('blur', searchSubmit);
$search.addEventListener('keydown', searchSubmit);
