import { Injectable } from '@angular/core';
import { } from '@types/googlemaps';
@Injectable()
export class DatasharingProviderService {
  // Array contain all the routes
  route = [];
  // Array contain all the waypoint
  waypoint = [];
  addwaypoint = false;
  drawPath = false;
  // Array contain all the selectedWayPoint
  selectedWayPoint = [];
  // Array contain all the checkPoints
  checkPoints = [];
  markers: any = [];
  // All google map varibale
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsDisplay: google.maps.DirectionsRenderer;
  marker: google.maps.Marker;
  infowindow: google.maps.InfoWindow;
  geocoder: google.maps.Geocoder;
  shareMode: any;
  latlngToBeShare: any;
  routeToBeShare: any;
  addPointInExistingRoutes: boolean = false;
  wayPointToBeAddedInRoute = { waypoint : []};
  locationToBeDrag: any;
  draginToRoute: boolean = false;
  constructor() { }
  // Display route between origin and destionatin with waypoints pass to it
  displayRoute(origin, destination, service, display, waypoints) {
    this.shareMode = 'route'
    var _this = this;
    service.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: 'DRIVING',
      optimizeWaypoints: true,
      avoidTolls: false
    }, function (response, status) {
      if (status === 'OK') {
        // _this.setMapOnAll(null);
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
  // Called when we add another waypoint in existing Route
  addWayPointInRoute(formatted_address) { 
    // Remove all marker and route from the map
    this.setMapOnAll(null);
    this.directionsDisplay.setMap(null);
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
      panel: document.getElementById('right-panel')
    });
    this.addwaypoint = false;
    this.drawPath = false;
    this.checkPoints = [];
    var arr = [];
    var obj = { 'name': '', 'waypoint': [] };
    obj.name = "Route";
    // Push new waypoint in existing route
    this.wayPointToBeAddedInRoute.waypoint.push(formatted_address)
    obj.waypoint = this.wayPointToBeAddedInRoute.waypoint;
    this.routeToBeShare = this.wayPointToBeAddedInRoute.waypoint;
    for (var i = 1; i < this.wayPointToBeAddedInRoute.waypoint.length - 1; i++) {
      var objTemp = { 'location': this.wayPointToBeAddedInRoute.waypoint[i] };
      arr.push(objTemp);
    }
    // call function for make new route
    this.displayRoute(this.wayPointToBeAddedInRoute.waypoint[0], this.wayPointToBeAddedInRoute.waypoint[this.wayPointToBeAddedInRoute.waypoint.length - 1], this.directionsService,
      this.directionsDisplay, arr);
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
}
