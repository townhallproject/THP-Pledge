Rx = rxjs; // Declare global for convenience's sake

var fullData;
var filteredData$ = new Rx.BehaviorSubject();
var selectedState$ = Rx.fromEvent($('#select--state option'), 'click');

// Seed initial data
var initalData = $.ajax({ url: 'data/testData.json' }).then((res) => {
  fullData = res;
  filteredData$.next(res);
});

