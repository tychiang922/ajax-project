var $searchBar = document.querySelector('#search-bar');
var searchLi = [];
function stockListSearch(userInput) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.twelvedata.com/symbol_search?outputsize=6&symbol=' + userInput);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var xhrIndex = 0; xhrIndex < xhr.response.data.length; xhrIndex++) {
      var xhrSymbol = xhr.response.data[xhrIndex].symbol;
      var xhrName = xhr.response.data[xhrIndex].instrument_name;
      searchLi.push(
        {
          symbol: xhrSymbol,
          name: xhrName
        }
      );
    }
  });
  xhr.send();
}

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

var $search = document.querySelector('.search');
$search.addEventListener('keyup', function topSixSearches(event) {
  if (searchLi.length > 6) {
    searchLi.splice(0, 6);
  }
  stockListSearch($search.value);
  console.log(searchLi);
  for (var searchIndex = 0; searchIndex < searchLi.length; searchIndex++) {
    var symbol = searchLi[searchIndex].symbol;
    var name = searchLi[searchIndex].name;
    console.log('value of symbol: ', symbol);
    console.log('value of name: ', name);
  }
});
