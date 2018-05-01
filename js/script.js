var fullData$ = new Rx.BehaviorSubject();
var filteredData$ = new Rx.BehaviorSubject();
var dataByState;

// Setup state selector
$( document ).ready(()=> {
  initStateSelector($('#select--state'));
  var selectedState$ = Rx.Observable.fromEvent($('#select--state'), 'change');
  selectedState$.subscribe(function(res) {
    let key = res.currentTarget.value;
    filteredData$.next(key ? {[key]: dataByState[key]} : dataByState);
  });
});

// Seed initial data
var initalData = $.ajax({ url: 'data/testData.json' }).then((res) => {
  dataByState = groupByState(res);
  filteredData$.next(dataByState);
  fullData$.next(res);
});


// Helper functions
function groupByState(data) {
  return data.reduce((res, record) => {
    let key = record.state;
    if (!res.hasOwnProperty(key)) {
      res[key] = [];
    }
    res[key].push(record);
    return res;
  }, {});
}

function initStateSelector(ele) {
  Object.keys(stateAbrvToName).forEach(key => {
    ele.append('<option value="' + key + '">' + stateAbrvToName[key] + '</option>');
  });
}
