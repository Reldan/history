// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */

function prepareData(urls) {
  console.log(urls)
  var n = _.map(urls, function(el) { 
    return parseUri(el.url).authority })
  var res = _.groupBy(n, function(el){ return el })
  var nRes = _.map(res, function(t) {console.log(t[0]); return {"label": t[0], "value": t.length}})
  nRes = _.sortBy(nRes, function(el) { return el.value })
  nRes = _.filter(nRes, function(el) {return el.value > 80})
  console.log(nRes)
  viz([{key: "VizData", values: nRes}])
}


chrome.history.search({text: "", maxResults: 0, startTime: 0}, prepareData)


function viz(data) {
  nv.addGraph({generate: function() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true)
  
    d3.select('#chart svg')
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

      d3.select('#chart svg')
        .attr('width', width)
        .attr('height', height)
        .call(graph);

    }
  }
}); 
}





// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  $('#myTab a').click(function (e) {
  e.preventDefault();
    $(this).tab('show');
  })
});
