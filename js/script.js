$( document ).ready(()=> {
  // Setup state select
  var selectedState$ = Rx.Observable.fromEvent($('#select--state'), 'change');

  selectedState$.subscribe(function(res) {
    console.log(res);
  });
});

var fullData;
var filteredData$ = new Rx.BehaviorSubject();
var dataByState;

// Seed initial data
var initalData = $.ajax({ url: 'data/testData.json' }).then((res) => {
  fullData = res;
  dataByState = groupByState(res);
  filteredData$.next(dataByState);
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
