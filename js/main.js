var apikey = '1113234349f9424cb830c124095055c8';
var $modal = document.querySelector('.modal');
var $search = document.querySelector('.search');
var $searchElement = document.querySelector('.search-element');
var $view = document.querySelectorAll('.view');
function searchAction() {
  if ($search.value === '') {
    $modal.setAttribute('class', 'modal hidden');
    $search.blur();
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.twelvedata.com/quote?symbol=' + $search.value + '&apikey=' + apikey);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.currentSearch = xhr.response;
  });
  xhr.send();
  data.view = 'quote';
  viewCheck();
  $modal.setAttribute('class', 'modal hidden');
}

function searchSubmit(event) {
  if (event.key === 'Enter') {
    searchAction();
    $search.blur();
  }
  if (event.type === 'blur') {
    searchAction();
  }
}

function viewCheck() {
  for (var viewIndex = 0; viewIndex < $view.length; viewIndex++) {
    var viewDataView = $view[viewIndex].getAttribute('data-view');
    if (viewDataView === data.view) {
      $view[viewIndex].setAttribute('class', 'view');
    } else {
      $view[viewIndex].setAttribute('class', 'view hidden');
    }
    if (viewDataView !== 'home') {
      $searchElement.setAttribute('class', 'search-box-quote');
    }
  }
}

$search.addEventListener('blur', searchSubmit);
$search.addEventListener('keydown', searchSubmit);
$search.addEventListener('focus', function modalBox(event) {
  $modal.setAttribute('class', 'modal');
});
