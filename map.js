/**
 * Created by liting on 3/23/15.
 */
function initialize() {
    var mapOptions = {
        center: { lat: 40.722505, lng: -73.992985},
        zoom: 14
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var NYSEmarker = new google.maps.Marker({
        position:new google.maps.LatLng(40.706816, -74.011260),
        map: map,
        title:"NYSE"
    });

    var NYUmarker = new google.maps.Marker({
        position:new google.maps.LatLng(40.729871, -73.996193),
        map: map,
        title:"NYU"
    });

    var IFCmarker = new google.maps.Marker({
        position:new google.maps.LatLng(40.730993, -74.001712),
        map: map,
        title:"IFC"
    });

    var CITYHallmarker = new google.maps.Marker({
        position:new google.maps.LatLng(40.713519, -74.006503),
        map: map,
        title:"NY city hall"
    });

    var contentHtml='<div><div><a href="%url%" >%name%</a> <span>%likes%</span></div><div><img src="%imgurl%" alt=""><span>Tel: %phone% </span></div></div>'


    var markers={'New York Stock Exchange':{"marker":NYSEmarker,"id":'431f7f00f964a52085271fe3'},'New York University':{"marker":NYUmarker,"id":'5058de7be4b007870dd7ad7a'},'New York City Hall':{"marker":CITYHallmarker,"id":'4a676321f964a52051c91fe3'},'IFC Center':{"marker":IFCmarker,"id":"42f00900f964a520b9261fe3"}};

    var apiurl="https://api.foursquare.com/v2/venues/%data%?client_id=4VL2YZKWW1PDC2OU5DMRDSLQH0OTJYNFAKPO4JFXYOKMEDJP&client_secret=JB5ZVQON05C5WR2U5FEWVYZLX1XL2JMVLEHVBPEAVO2CMBMM&v=20150315";
    for (var key in markers) {
        (function(realkey){
        var clickMarker=markers[realkey];
        var venueurl=apiurl.replace('%data%',clickMarker.id);
        var contentString;
        $.ajax({
            url: venueurl,
            jsonp: "callback",
            dataType: "jsonp",
            success: function( response ) {
                var clickVenue=response.response.venue;
                console.log( clickVenue );
                 contentString=contentHtml.replace('%url%',clickVenue.canonicalUrl).replace('%name%',clickVenue.name).replace('%likes%',clickVenue.likes.summary).replace('%imgurl%',clickVenue.bestPhoto.prefix+'150x100'+clickVenue.bestPhoto.suffix ).replace('%phone%',clickVenue.contact.formattedPhone);
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                google.maps.event.addListener(clickMarker.marker, 'click', function() {
                    infowindow.open(map,clickMarker.marker);
                });
            }
        });})(key);
    }



    function AppViewModel()  {
        var self=this;
        self.places = ko.observableArray(['New York Stock Exchange', 'New York University','New York City Hall','IFC Center' ]);
        self.condition= ko.observable(),
        self.beginSearch=function(keyword) {
                for (var key in markers) {
                    if (key.toLowerCase()===keyword.toLowerCase()) {
                        markers[key].marker.setMap(map);
                        google.maps.event.trigger(markers[key].marker, 'click');

                    }
                    else {
                        markers[key].marker.setMap(null);
                    }

                }
            };
    };

    ko.applyBindings(new AppViewModel());



}
google.maps.event.addDomListener(window, 'load', initialize);
