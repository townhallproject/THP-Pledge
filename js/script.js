var fullData$ = new Rx.BehaviorSubject();
var filteredData$ = new Rx.BehaviorSubject();
var dataByStateAndDistrict;

// Setup state selector
$( document ).ready(()=> {
  initStateSelector($('#select--state'));
  var selectedState$ = Rx.Observable.fromEvent($('#select--state'), 'change');
  selectedState$.subscribe(function(res) {
    let key = res.currentTarget.value;
    filteredData$.next(key ? {[key]: dataByStateAndDistrict[key]} : dataByStateAndDistrict);
  });
});

// Seed initial data
var initalData = $.ajax({ url: 'data/testData.json' }).then((res) => {
  dataByStateAndDistrict = groupByStateAndDistrict(res);
  filteredData$.next(dataByStateAndDistrict);
  fullData$.next(res);
});


// Helper functions
function groupByStateAndDistrict(data) {
  return data.reduce((res, record) => {
    let state = record.state;
    let district = getDistrictKey(record);
    if (!res.hasOwnProperty(state)) {
      res[state] = {};
    }
    if (!res[state].hasOwnProperty(district)) {
      res[state][district] = [];
    }
    res[state][district].push(record);
    return res;
  }, {});
}

function getDistrictKey(record) {
  return record.district || record.office;
}

function initStateSelector(ele) {
  Object.keys(stateAbrvToName).forEach(key => {
    ele.append('<option value="' + key + '">' + stateAbrvToName[key] + '</option>');
  });
}
