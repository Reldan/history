# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

###
Global variable containing the query we'd like to pass to Flickr. In this
case, kittens!

@type {string}
###
prepareData = (urls) ->
  console.log urls
  n = _.map urls, (el) -> parseUri(el.url).authority
  res = _.groupBy n, (el) -> el
  nRes = _.map res, (t) ->
    console.log t[0]
    label: t[0]
    value: t.length
  nRes = _.filter nRes, (el) -> el.value > 80
  nRes = _.sortBy nRes, 'value'
  console.log nRes
  viz [
    key: 'VizData'
    values: nRes
  ]

viz = (data) ->
  nv.addGraph
    generate: ->
      chart = nv.models.discreteBarChart().x((d) ->
        d.label
      ).y((d) ->
        d.value
      ).staggerLabels(true).tooltips(false).showValues(true)
      d3.select('#chart svg').datum(data).attr(width: 1000, height: 500).transition().duration(500).call chart
      nv.utils.windowResize chart.update
      chart

    callback: (graph) ->
      window.onResize = ->
        width = nv.utils.windowSize().width - 20
        height = nv.utils.windowSize().height - 20
        margin = graph.margin()
        width = Math.max width, margin.left + margin.right + 20
        height = Math.max height, margin.top + margin.bottom + 20
        graph.width(width).height height
        d3.select("#chart svg").attr("width", width).attr("height", height).call graph

chrome.history.search
  text: ''
  maxResults: 0
  startTime: 0
, prepareData

# Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener 'DOMContentLoaded', ->
  $('#myTab a').click (e) ->
    e.preventDefault()
    $(this).tab 'show'

