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

// Data
const stateAbrvToName = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
}

const stateNameToAbrv = Object.keys(stateAbrvToName).reduce(function(obj, key){
  obj[stateAbrvToName[key]] = key;
  return obj;
}, {});
