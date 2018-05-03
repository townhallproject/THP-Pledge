$( document ).ready(()=> {

$table = $('#table--state');

filteredData$.subscribe(data => {
  if (!data) { return; }
  $table.empty();

  let hasRecords = Object.keys(data).length > 1 || Object.keys(data[Object.keys(data)[0]]).length > 0;
  if (hasRecords) {
    Object.keys(data).forEach(key => {
      $table.append('<h4 class="mt-4">' + stateAbrvToName[key] + '</h4>'); 
      addRow(key, data[key])
    });
  } else {
    $table.append('<div class="row mt-4"><div class="col-12"><h4>No data for ' + stateAbrvToName[Object.keys(data)[0]] + '</h4></div></div>'); 
  }
});

function addRow(stateAbrv, stateObj) {
  var $row = $('<div class="card-deck"></div>').appendTo($table); 
  Object.keys(stateObj).forEach((district, index) => {
    // Card header
    let card = '<div class="card p-0 mb-5"><div class="card-header">' + 
                  stateAbrv + (parseInt(district) ? '-' + district + ' ' + officeDict['rep'] : ' ' + officeDict[district]) + 
               '</div><ul class="list-group list-group-flush">'

    // Card body
    Object.keys(stateObj[district]).forEach(record => {
      card += '<li class="list-group-item">' + stateObj[district][record].name + '</li>';
    });

    card += '</ul></div>';
    $row.append(card);

    // Add column breaks to improve responsiveness
    if ((index + 1) % 2 === 0) {
      $row.append('<div class="w-100 d-block d-xl-none"></div>');
    }
    if ((index + 1) % 3 === 0) {
      $row.append('<div class="w-100 d-none d-xl-block"></div>');
    }
  });
}

});