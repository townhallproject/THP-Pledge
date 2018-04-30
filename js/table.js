$( document ).ready(()=> {

$table = $('#table--state');

filteredData$.subscribe(data => {
  $table.empty();
  Object.keys(data).forEach(key => addRow(key, data[key]));
});

function addRow(key, arr) {
  let row = '<div class="row"><div class="col-12">' + key + '</div></div>';
  arr.forEach(record => {
    row += '<div class="col-3">' + record.firstName + ' ' + record.lastName + '</div>';
  });
  $table.append(row);
}

});