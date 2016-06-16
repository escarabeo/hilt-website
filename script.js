
function createMap(data) {

  var map = L.map('map')

  var layer = L.tileLayer('https://api.mapbox.com/styles/v1/parmis/ciph6pogj000vbinj3k3m5v3n/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGFybWlzIiwiYSI6ImNpcGg2bXc4ZjAwemV0em1kNGdrcjQxbGIifQ.jHorJ1N44yJkhPejjTNXjQ')

  map.addLayer(layer);

  map.setView([0, 0], 3);

  var markers = [];

  _.each(data.features, function(feature) {

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    var marker = L.circleMarker([lat, lon], {
      className: 'toponym',
      offset: Number(feature.properties.offset),
    });

    marker.bindPopup(feature.properties.toponym);

    markers.push(marker);
    map.addLayer(marker);

  });

  // ** slider

  var input = $('#slider input');

  var max = _.last(data.features).properties.offset;
  input.attr('max', max);

  input.on('input', function() {

    var offset = Number(input.val());

    _.each(markers, function(marker) {

      if (marker.options.offset < offset) {
        map.addLayer(marker);
      }

      else {
        map.removeLayer(marker);
      }

    });

  });

  input.trigger('input');

  // ** Marker clusters

  var clusters = L.markerClusterGroup();

  _.each(markers, function(marker) {
    clusters.addLayer(marker);
  });

  map.addLayer(clusters);

  // ** heatmap

  var points = _.map(data.features, function(feature) {

    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];

    return[lat, lon, 1];

  });

  var heat = L.heatLayer(points, {
    minOpacity: 0.3
  });

  map.addLayer(heat);

}

// On page start
$(function() {
  $.getJSON('80-days.geojson', function(data) {
    createMap(data);
  });
});
