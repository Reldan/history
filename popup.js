function mills2weeks(mil) {
  var seconds = (mil / 1000) | 0;
  mil -= seconds * 1000;

  var minutes = (seconds / 60) | 0;
  seconds -= minutes * 60;

  var hours = (minutes / 60) | 0;
  minutes -= hours * 60;

  var days = (hours / 24) | 0;
  hours -= days * 24;

  var weeks = (days / 7) | 0;
  days -= weeks * 7;

  return weeks;
}

function objectToList(p) {
  var arr = []
  for (var key in p) {
    if (p.hasOwnProperty(key)) {
      arr.push([parseInt(key), p[key]]);
    }
  }
  return arr;
}


function prepareData(urls) {
  var n = _.map(urls, function(el) { return parseUri(el.url).authority })
  var res = _.groupBy(n, function(el){ return el })
  var res2 = _.groupBy(urls, function(el){ return parseUri(el.url).authority })
  var nnRes = _.map(res2, function(el) { 
    var groupped = _.countBy(el, function (elUrl) { return mills2weeks(elUrl.lastVisitTime) } )
    return {"key": parseUri(el[0].url).authority, "values": objectToList(groupped)}
  } );
  console.log(nnRes); // for stackking
  console.log(JSON.stringify(nnRes)); // for stackking
  var nRes = _.map(res, function(t) { return {"label": t[0], "value": t.length}});
  nRes = _.sortBy(nRes, function(el) { return el.value });
  nRes = _.filter(nRes, function(el) { return el.value > 80 });
  viz([{key: "VizData", values: nRes}]);
  viz2(nnRes);
}


function viz2(data) {
  console.log("vix")
  // var colors = d3.scale.category20();
  // keyColor = function(d, i) {return colors(d.key)};
  var histcatexplong = [{"key": "key 1", "values": [[1, 5], [2, 25], [3, 45]]},
                        {"key": "key 2", "values": [[1, 15],[2, 7],  [3, 0]]}];

  var chart2;
  nv.addGraph(function() {
    chart2 = nv.models.stackedAreaChart()
                 // .width(600).height(500)
                  // .useInteractiveGuideline(true)
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  // .color(keyColor)
                  .transitionDuration(300);
                  //.clipEdge(true);

  // chart.stacked.scatter.clipVoronoi(false);

    d3.select('#chart2 svg')
      .datum(histcatexplong)
      .transition().duration(0)
      .call(chart2);

    nv.utils.windowResize(chart2.update);

    // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
    console.log("dfsadf")
    return chart2;
  });

}

function viz(data) {
  nv.addGraph({generate: function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true)
  
    d3.select('#chart1 svg')
       .datum(data)
       .attr('width', 1000)
       .attr('height', 500)
       .transition().duration(500)
       .call(chart);
 
   nv.utils.windowResize(chart.update);
 
   return chart;
 },
 callback: function(graph) {

  window.onResize = function() {
      var width = nv.utils.windowSize().width - 20,
          height = nv.utils.windowSize().height - 20,
          margin = graph.margin();


      if (width < margin.left + margin.right + 20)
        width = margin.left + margin.right + 20;

      if (height < margin.top + margin.bottom + 20)
        height = margin.top + margin.bottom + 20;


      graph
         .width(width)
         .height(height);

      d3.select('#chart1 svg')
        .attr('width', width)
        .attr('height', height)
        .call(graph);

      d3.select('#chart2 svg')
        .attr('width', width)
        .attr('height', height)
        .call(graph);

    }
  }
}); 
}


// Run script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  console.log("hello")
  chrome.history.search({text: "", maxResults: 0, startTime: 0}, prepareData)

  $('#myTab a').click(function (e) {
  e.preventDefault();
    $(this).tab('show');
  })
});
