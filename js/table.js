$( document ).ready(()=> {

$table = $('#table--state');

filteredData$.subscribe(data => {
  $table.empty();
  let length = Object.keys(data).length;
  if ( length > 1) {
    Object.keys(data).forEach(key => {
      $table.append('<div class="row"><div class="col-12"><h4>' + stateAbrvToName[key] + '</h4></div></div>'); 
      addRow(data[key])
    });
  } else if (length === 1) {
    if (data[Object.keys(data)[0]]) {
      // Don't bother with headers if only one state is shown
      addRow(data[Object.keys(data)[0]]);
    } else {
      $table.append('<div class="row"><div class="col-12"><h4>No data for ' + stateDict[Object.keys(data)[0]] + '</h4></div></div>'); 
    }
  }
});

function addRow(arr) {
  arr.forEach(record => {
    $table.append('<div class="col-3">' + record.name + '</div>');
  });
  
}

});