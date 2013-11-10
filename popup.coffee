

mills2weeks = (mil) ->
  seconds = (mil / 1000) | 0
  mil -= seconds * 1000
  minutes = (seconds / 60) | 0
  seconds -= minutes * 60
  hours = (minutes / 60) | 0
  minutes -= hours * 60
  days = (hours / 24) | 0
  hours -= days * 24
  weeks = (days / 7) | 0
  days -= weeks * 7
  return weeks



objectToList = (p) ->
  arr = []
  for key of p
    if (p.hasOwnProperty(key))
      arr.push([parseInt(key), p[key]])
  return arr

prepareData = (urls) ->
  console.log urls
  n = _.map urls, (el) -> parseUri(el.url).authority
  res = _.groupBy n, (el) -> el
  res2 = _.groupBy urls, (el) -> parseUri(el.url).authority
  allWeeks = []
  nnRes = _.map res2, (el) ->
    groupped = _.countBy el, (elUrl) ->
      week = mills2weeks(elUrl.lastVisitTime)
      allWeeks[week] = week
      week
    key: parseUri(el[0].url).authority
    values: objectToList(groupped)
  nnRes = _.map res2, (el) ->
    groupped = _.countBy el, (elUrl) ->
      mills2weeks(elUrl.lastVisitTime)
    _.each allWeeks, (el) -> groupped[el] = 0 if (_.isUndefined(groupped[el]))
    key: parseUri(el[0].url).authority
    values: objectToList(groupped)
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
  viz2(nnRes)

viz2 = (data) ->
  chart2
  nv.addGraph
    generate: ->
      chart2 = nv.models.stackedArea().x((d) ->
        d[0]
      ).y((d) ->
        d[1]
      )
      d3.select('#chart2 svg').datum(data).call(chart2)
      nv.utils.windowResize(chart2.update)
      chart2


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

