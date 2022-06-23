var apikey = '1113234349f9424cb830c124095055c8';
var $modal = document.querySelector('.modal');
var $search = document.querySelector('.search');
var $searchElement = document.querySelector('.search-element');
var $view = document.querySelectorAll('.view');
var $closeColor = document.querySelector('.close-color');
var fullDate = new Date();
var dateDay = fullDate.getDate();
var dateYear = fullDate.getFullYear();
var dateMonth = fullDate.getMonth() + 1;
data.currentDate = dateYear + '-' + dateMonth + '-' + dateDay;

function searchAction() {
  if ($search.value === '') {
    $modal.setAttribute('class', 'modal hidden');
    $search.blur();
    return;
  }
  xhrQuoteRequest();
  xhrAfterHourRequest();
  xhrStockTime();
  data.view = 'quote';
  viewCheck();
  $modal.setAttribute('class', 'modal hidden');
  $search.value = '';
}

function xhrQuoteRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.twelvedata.com/quote?symbol=' + $search.value + '&apikey=' + apikey);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.currentSearch = xhr.response;
    quoteCreation();
  });
  xhr.send();
}

function xhrAfterHourRequest() {
  var xhrAfter = new XMLHttpRequest();
  xhrAfter.open('GET', 'https://api.twelvedata.com/price?symbol=' + $search.value + '&apikey=' + apikey);
  xhrAfter.responseType = 'json';
  xhrAfter.addEventListener('load', function () {
    data.currentSearchAfter = Number(xhrAfter.response.price);
    quoteAfterCreation();
  });
  xhrAfter.send();
}

function xhrStockTime() {
  var xhrStockTime = new XMLHttpRequest();
  // date = 2022-06-22
  xhrStockTime.open('GET', 'https://api.twelvedata.com/time_series?start_date=' + data.currentDate + '&symbol=' + $search.value + '&interval=1min&apikey=' + apikey);
  xhrStockTime.responseType = 'json';
  xhrStockTime.addEventListener('load', function () {
    data.currentSearch.dayOneInterval = [];
    for (var stockIndex = xhrStockTime.response.values.length - 1; stockIndex >= 0; stockIndex--) {
      data.currentSearch.dayOneInterval.push(xhrStockTime.response.values[stockIndex].close);
    }
    var $graphPlaceHolder = document.querySelector('.graph-placeholder');
    $graphPlaceHolder.setAttribute('src', "https://quickchart.io/chart?c={type:'sparkline',data:{datasets:[{data:[" + data.currentSearch.dayOneInterval + ']}]}}');
  });
  xhrStockTime.send();
}

function searchSubmit(event) {
  if (event.key === 'Enter') {
    searchAction();
    $search.blur();
  }
  if (event.type === 'blur') {
    if (data.view !== 'home') {
      $modal.setAttribute('class', 'modal hidden');
      return;
    }
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

function numberToFixedTwo(string) {
  return (Number(string)).toFixed(2);
}

function quoteCreation() {
  var $range = document.querySelector('#range');
  var $change = document.querySelector('#change');
  var changeQuote = Number(data.currentSearch.change);
  var $close = document.querySelector('#close');
  var closeNumber = Number(data.currentSearch.close);
  var $percentChange = document.querySelector('#percent-change');
  var $title = document.querySelector('.title');
  var $open = document.querySelector('#open');
  var $closeList = document.querySelector('#closeList');
  var $low = document.querySelector('#low');
  var $high = document.querySelector('#high');
  var $volume = document.querySelector('#volume');
  var $avgVolume = document.querySelector('#avg-volume');
  var $yearRange = document.querySelector('#year-range');
  var $yearLow = document.querySelector('#year-low');
  var $yearHigh = document.querySelector('#year-high');
  var $yearLowChange = document.querySelector('#year-low-change');
  var $yearHighChange = document.querySelector('#year-high-change');
  var $yearPercLowChange = document.querySelector('#year-perc-low-change');
  var $yearPercHighChange = document.querySelector('#year-perc-high-change');
  $range.textContent = (Number(data.currentSearch.open)).toFixed(2) + '~' + (Number(data.currentSearch.close)).toFixed(2);
  $close.textContent = (closeNumber).toFixed(2);
  $change.textContent = changeQuote.toFixed(2);
  $percentChange.textContent = '(' + (Number(data.currentSearch.percent_change)).toFixed(2) + '%' + ')';
  if (changeQuote > 0) {
    $closeColor.setAttribute('class', 'row close-color txt-green head-change screen-inline');
    $change.textContent = '+' + changeQuote.toFixed(2);
    $percentChange.textContent = '(' + '+' + (Number(data.currentSearch.percent_change)).toFixed(2) + '%' + ')';
  } else {
    $closeColor.setAttribute('class', 'row close-color txt-red head-change screen-inline');
  }
  $title.textContent = data.currentSearch.symbol + ' (' + data.currentSearch.name + ')';
  $open.textContent = numberToFixedTwo(data.currentSearch.open);
  $closeList.textContent = numberToFixedTwo(data.currentSearch.close);
  $low.textContent = numberToFixedTwo(data.currentSearch.low);
  $high.textContent = numberToFixedTwo(data.currentSearch.high);
  $volume.textContent = (Number(data.currentSearch.volume)).toFixed();
  $avgVolume.textContent = (Number(data.currentSearch.average_volume)).toFixed();
  var yearLow = numberToFixedTwo(data.currentSearch.fifty_two_week.low);
  var yearHigh = numberToFixedTwo(data.currentSearch.fifty_two_week.high);
  $yearRange.textContent = yearLow + '~' + yearHigh;
  $yearLow.textContent = yearLow;
  $yearHigh.textContent = yearHigh;
  $yearLowChange.textContent = numberToFixedTwo(data.currentSearch.fifty_two_week.low_change);
  $yearHighChange.textContent = numberToFixedTwo(data.currentSearch.fifty_two_week.high_change);
  $yearPercLowChange.textContent = numberToFixedTwo(data.currentSearch.fifty_two_week.low_change_percent);
  $yearPercHighChange.textContent = numberToFixedTwo(data.currentSearch.fifty_two_week.high_change_percent);
}

function quoteAfterCreation() {
  var $extendedPrice = document.querySelector('#extended-price');
  var $extendedChange = document.querySelector('#extended-change');
  var closeNumber = Number(data.currentSearch.close);
  var $extendedPercent = document.querySelector('#extended-percent');
  $extendedPrice.textContent = data.currentSearchAfter;
  var extendedChange = (data.currentSearchAfter - closeNumber).toFixed(2);
  var extendedPercent = ((extendedChange / closeNumber) * 100).toFixed(2);
  var $afterColor = document.querySelector('.after-color');
  if (extendedChange > 0) {
    $extendedChange.textContent = '+' + extendedChange;
    $extendedPercent.textContent = '(' + '+' + extendedPercent + '%' + ')';
    $afterColor.setAttribute('class', 'row after-color txt-green head-change screen-inline');
  } else {
    $extendedChange.textContent = extendedChange;
    $extendedPercent.textContent = '(' + extendedPercent + '%' + ')';
    $afterColor.setAttribute('class', 'row after-color txt-red head-change screen-inline');
  }
}
