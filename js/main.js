var $searchBar = document.querySelector('#search-bar');
function stockListSearch(userInput) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.twelvedata.com/symbol_search?outputsize=6&symbol=' + userInput);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var xhrIndex = 0; xhrIndex < xhr.response.data.length; xhrIndex++) {
      var xhrSymbol = xhr.response.data[xhrIndex].symbol;
      var xhrName = xhr.response.data[xhrIndex].instrument_name;
      var searchLi = searchLiGenerator(xhrSymbol, xhrName);
      $searchBar.appendChild(searchLi);
    }
  });
  xhr.send();
}
stockListSearch('aa');

function searchLiGenerator(stockSymbol, stockName) {
  var $li = document.createElement('li');
  $li.setAttribute('class', 'search-li');
  var $row = document.createElement('div');
  $row.setAttribute('class', 'row');
  var $colOneFifth = document.createElement('div');
  $colOneFifth.setAttribute('class', 'col-1-fifth');
  var $pSymbol = document.createElement('p');
  $pSymbol.textContent = stockSymbol;
  var $colFourFifth = document.createElement('div');
  $colFourFifth.setAttribute('class', 'col-4-fifth');
  var $pStockName = document.createElement('p');
  $pStockName.textContent = stockName;

  $colFourFifth.appendChild($pStockName);
  $row.appendChild($colOneFifth);
  $colOneFifth.appendChild($pSymbol);
  $row.appendChild($colFourFifth);
  $li.appendChild($row);
  return $li;
}
