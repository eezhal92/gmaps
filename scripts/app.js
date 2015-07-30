var map,
    markers = [],
    trafficLayer,
    infoWindow;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 8,
    center: {lat: -6.751896, lng: 110.852051} //-6.751896, 110.852051
  });

  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
}

function getResource(resource) {

    $.get('datas/' + resource + '.json')
      .success(handleSuccess)
      .error(handleError);

    function handleSuccess(data) {
      data = JSON.parse(data);
      clearMap();

      $.each(data.place, function(i, place) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(place.latitude, place.longitude),
          map: map,
          title: place.lokasi
        });

        var contentStr = '<div><b>'+ place.lokasi +'</b><br><p>'+ place.alamat +'</p></div>';

        infoWindow = new google.maps.InfoWindow({
            maxWidth: 200,
            content: contentStr
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.close();
          infoWindow.open(map, marker);
        });

        markers.push(marker);
      });
    }

    function handleError(data) {
      console.log("error: ", data);
      alert(data.status + " : Sorry, " + data.statusText);
    }

}

function clearMap() {
  for(var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }

  markers = [];
}

$(function() {
  $('.nav li a').click(function() {
    var resource = $(this).data("resource");
    getResource(resource);
  });
});

google.maps.event.addDomListener(window, 'load', initialize);
// setTimeout(getResource, 3000);
