$( document ).ready(()=> {

$table = $('#table--state');

filteredData$.subscribe(data => {
  if (!data) { return; }
  $table.empty();

  Object.keys(data).forEach(key => {
    $table.append('<h4 class="mt-4">' + stateAbrvToName[key] + '</h4>');
    addRow(key, data[key])
  });
});

function addRow(stateAbrv, stateObj) {
  var $row = $('<div class="card-deck"></div>').appendTo($table);
  Object.keys(stateObj).forEach((district, index) => {
    // Card header
    let card = '<div class="card p-0 mb-5"><div class="card-header">' +
                  stateAbrv + (parseInt(district) ? '-' + district + ' ' + officeDict['Rep'] : ' ' + officeDict[district]) +
               '</div><ul class="list-group list-group-flush">'

    // Card body
    const incumbent = stateObj[district].filter(record => record.incumbent === true)[0] || false;
    if (incumbent) {
      card += '<li class="list-group-item">Incumbent <strong>' + incumbent.displayName + '</strong> ' + takenThePledge(incumbent) + '</li>';
    }

    stateObj[district].filter(record => record.incumbent === false && record.pledged === true).forEach(candidate => {
      card += '<li class="list-group-item">Candidate <strong>' + candidate.displayName + '</strong> has taken the pledge.</li>';
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