var apikey = '1113234349f9424cb830c124095055c8';
var $body = document.querySelector('body');
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

var $folder = document.querySelector('.fa-folder-open');
var $modalFolderBlur = document.querySelector('.modal-folder-blur');
var $modalFolder = document.querySelector('.modal-folder');
$folder.addEventListener('click', function displayBookmarks() {
  $modalFolder.setAttribute('class', 'modal-folder');
});

$modalFolderBlur.addEventListener('click', function exitModal() {
  $modalFolder.setAttribute('class', 'modal-folder hidden');
});

function searchAction() {
  data.currentSearch = {};
  if ($search.value === '') {
    $modal.setAttribute('class', 'modal pos-abs-modal hidden');
    $search.blur();
    return;
  }
  xhrQuoteRequest();
  xhrAfterHourRequest();
  xhrStockTime();
  displayRecentSearch();
  data.view = 'quote';
  viewCheck();
  $modal.setAttribute('class', 'modal pos-abs-modal hidden');
  $search.value = '';
}

function displayRecentSearch() {
  var $recentSearch = document.querySelector('#recent-search');
  var $liAll = document.querySelectorAll('.recent-search-li');
  var $recentSearchFolder = document.querySelector('#recent-search-folder');
  if ($liAll.length > 0) {
    for (var liIndex = 0; liIndex < $liAll.length; liIndex++) {
      $liAll[liIndex].remove();
    }
  }
  if (data.lastFiveSearch.length > 0) {
    for (var curIndex = 0; curIndex < data.lastFiveSearch.length; curIndex++) {
      var li = recentSearchLiGenerator(data.lastFiveSearch[curIndex]);
      $recentSearch.append(li);
      var li2 = recentSearchLiGenerator(data.lastFiveSearch[curIndex]);
      $recentSearchFolder.append(li2);
    }
  }
}

function recentSearchLiGenerator(array) {
  var $recentSearchLi = document.createElement('li');
  $recentSearchLi.setAttribute('class', 'recent-search-li');
  var $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  var $col2 = document.createElement('div');
  $col2.setAttribute('class', 'col-2');
  var $col22 = document.createElement('div');
  $col22.setAttribute('class', 'col-2');
  var $symbolP = document.createElement('p');
  $symbolP.setAttribute('class', 'text-center');
  $symbolP.textContent = array.symbol;
  var $valueP = document.createElement('p');
  $valueP.textContent = Number(array.close).toFixed(2);
  if (Number(array.change) < 0) {
    $valueP.setAttribute('class', 'text-center txt-red');
  } else {
    $valueP.setAttribute('class', 'text-center txt-green');
  }
  $col2.appendChild($symbolP);
  $col22.appendChild($valueP);
  $row.appendChild($col2);
  $row.appendChild($col22);
  $recentSearchLi.appendChild($row);
  return $recentSearchLi;
}

function xhrQuoteRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.twelvedata.com/quote?symbol=' + $search.value + '&apikey=' + apikey);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var key in xhr.response) {
      data.currentSearch[key] = xhr.response[key];
    }
    quoteCreation();
    data.lastFiveSearch.unshift(data.currentSearch);
  });
  xhr.send();
}

function xhrAfterHourRequest() {
  var xhrAfter = new XMLHttpRequest();
  xhrAfter.open('GET', 'https://api.twelvedata.com/price?symbol=' + $search.value + '&apikey=' + apikey);
  xhrAfter.responseType = 'json';
  xhrAfter.addEventListener('load', function () {
    data.currentSearch.afterHour = Number(xhrAfter.response.price).toFixed(2);
    quoteAfterCreation();
  });
  xhrAfter.send();
}

function xhrStockTime() {
  var xhrStockTime = new XMLHttpRequest();
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
      $body.setAttribute('class', 'bk-bluegreen');
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
  var $extendedChange = document.querySelector('#extended-change');
  var $extendedPercent = document.querySelector('#extended-percent');
  var extendedChange = (data.currentSearch.afterHour - closeNumber).toFixed(2);
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

function quoteAfterCreation() {
  var $extendedPrice = document.querySelector('#extended-price');
  $extendedPrice.textContent = data.currentSearch.afterHour;
}
