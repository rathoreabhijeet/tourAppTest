import { Component, Inject, ViewChild, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_LOCALE, fadeInContent } from '@angular/material';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MatDatepicker } from '@angular/material/datepicker';
import { Route } from './Route'
import { } from '@types/googlemaps';
import { ShareModalComponent } from './share-modal/share-modal.component'
import { DatasharingProviderService } from './datasharing-provider.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('gmap') gmapElement: any;
  // Boolean for show hide button
  addWaypointDiv: boolean;
  wayPointlatlng: any;
  wayPoints: any;
  windowOpened: boolean = false;
  latLng: any;
  routes = [];
  selectedWayPoint = [];
  constructor(private DatasharingProviderService: DatasharingProviderService, private _zone: NgZone, public dialog: MatDialog) {
    this.addWaypointDiv = false;
    this.wayPoints = [];
    DatasharingProviderService.route = this.routes;
    DatasharingProviderService.waypoint = this.wayPoints;
  }
  ngOnInit() {
    // This is initiallization function for app component
    var _this = this;
    var myLatlng = { lat: null, lng:  null};
    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //initializing map
    this.DatasharingProviderService.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    //initializing directionsService
    this.DatasharingProviderService.directionsService = new google.maps.DirectionsService();
    //initializing geocoder
    this.DatasharingProviderService.geocoder = new google.maps.Geocoder();
    //initializing directionsDisplay
    this.DatasharingProviderService.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.DatasharingProviderService.map,
      panel: document.getElementById('right-panel')
    });
    //initializing Marker;
    this.DatasharingProviderService.marker = new google.maps.Marker;
    //set click listener on map;
    this.DatasharingProviderService.map.addListener('click', function (e) {
      if (_this.DatasharingProviderService.addwaypoint) { 
        _this.placeMarkerAndPanTo(e.latLng, _this.DatasharingProviderService.map);
        _this.wayPointlatlng = e.latLng;
      }
      // executed when clicked on marker
    });
  }
  removePath() { 
    // set directionsDisplay to null so current Path is removed from map
    this.DatasharingProviderService.directionsDisplay.setMap(null);
  }
  //This function places marker on map and pan map to location of marker
  placeMarkerAndPanTo(latLng, map) {
    this.setMapOnAll(null);
    // Check info window of marker. If info window already exists then close it 
    // first and open for another marker
    if (this.windowOpened) { 
      this.DatasharingProviderService.infowindow.close();
    }
    this.latLng = latLng;
    // Draw marker
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
    // Push all markers to an array
    this.DatasharingProviderService.markers.push(marker);
    // Change map to latlan which is passed
    map.panTo(latLng);
    //Html for info window
    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Are you sure you want to add this location to Waypoint?</h1>' +
      '<div style="text-align:center">' +
      '<button id="confirm" style="background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text - align: center;text - decoration: none;display: inline - block;font - size: 16px;margin: 4px 2px;cursor: pointer;" >Add to way point</button>' +
      '<button id="cancel" style="background-color: #f44336;border: none;color: white;padding: 15px 32px;text - align: center;text - decoration: none;display: inline - block;font - size: 16px;margin: 4px 2px;cursor: pointer;">Cancel</button>' +
      '</div>' +
      '</div>';
    //Initiallize info window with html and width
    this.DatasharingProviderService.infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 400
    });
    //Set listener on info window
    this.DatasharingProviderService.infowindow.addListener('click', function () {
    });
    //Open info window
    this.DatasharingProviderService.infowindow.open(map, marker);
    this.windowOpened = true;
    //Set action listener on buttons which are in info window. 
    // Here (click) will not work because it is out of scope
    document.getElementById("confirm").addEventListener("click", () => {
      this.addToWayPoint()
    });
    document.getElementById("cancel").addEventListener("click", () => {
      this.notAddToWayPoint()
    });
  }
  // Close info window when user clicks on cancel button
  notAddToWayPoint() {
    this.windowOpened = false; 
    this.DatasharingProviderService.infowindow.close();
  }
  // Close info window and position pushed in waypoint list when user clicks on confirm button
  addToWayPoint() {
    this.windowOpened = false; 
    this.DatasharingProviderService.infowindow.close();
    // Convert latLng in to formatted address
    this.geocodeLatLng(this.DatasharingProviderService.geocoder, this.latLng);
  }
  // call when user clicks on 'Add way point' button 
  showAddWayPointDiv(temp) {
    this.addWaypointDiv = temp;
  }
  // Convert latLng in formatted address
  geocodeLatLng(geocoder, latlng) {
    //Assign this to another local varible to share this
    var _this = this;
    // get Lat and Lng from latlng function
    var latlngArr: any = { lat: latlng.lat(), lng: latlng.lng() };
    geocoder.geocode({ 'location': latlngArr }, function (results, status) {
      if (status === 'OK') {
        // If your lat lng is right then google gives result with status 'OK'
        if (_this.DatasharingProviderService.addPointInExistingRoutes) {
          _this.DatasharingProviderService.addwaypoint = false;
          _this.DatasharingProviderService.addPointInExistingRoutes = false;
          _this.DatasharingProviderService.addWayPointInRoute(results[0].formatted_address)
        }
        if (results[0]) {
          // With zone.run(...) we explicitely make code execute inside Angulars zone and change detection is run afterwards.
            _this._zone.run(() => { // <== added
              _this.DatasharingProviderService.waypoint.push(results[0].formatted_address);
            });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  // Display route between origin and destionatin with waypoints passed to it
  displayRoute(origin, destination, service, display, waypoints) {
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
        // If your lat lng is right then google gives result with status 'OK'
        _this.DatasharingProviderService.draginToRoute = true;
        _this.setMapOnAll(null);
        _this.DatasharingProviderService.selectedWayPoint = [];
        _this.DatasharingProviderService.checkPoints = [];
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }
  // Remove all markers from function
  setMapOnAll(map) {
    for (var i = 0; i < this.DatasharingProviderService.markers.length; i++) {
      this.DatasharingProviderService.markers[i].setMap(map);
    }
  }
  // All drag and Drop function
  // This function allows drop on particular div
  allowDrop(ev) {
    ev.preventDefault();
  }
  // called when any another div dropped in particualr div 
  drop(ev) {
    var _this = this;
    // Remove all marker and route from the map
    this.DatasharingProviderService.directionsDisplay.setMap(null);
    this.setMapOnAll(null);
    // Check the dropped location is to be placed in route or not
    if (this.DatasharingProviderService.draginToRoute) {
      // If is to be placed in route the called function from provider which drow oath with new waypoints
      this.DatasharingProviderService.addWayPointInRoute(this.DatasharingProviderService.locationToBeDrag)
    } else {
      // Convert address in to latLng and drop marker in map which shows dropped location
      this.DatasharingProviderService.geocoder.geocode({ 'address': this.DatasharingProviderService.locationToBeDrag }, function (results, status) {
        if (results && results[0] && results[0].geometry && results[0].geometry.location) {
          _this.DatasharingProviderService.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: _this.DatasharingProviderService.map,
            position: results[0].geometry.location
          });
          // Remove all locations from selected array and clean the check poins in wayPoint component
          _this.DatasharingProviderService.markers.push(marker);
          _this.DatasharingProviderService.selectedWayPoint = [];
          _this.DatasharingProviderService.checkPoints = [];
        } else {
          alert('Could not put all the markers you have requsted directions due to: Error');
        }
      });
    }
  }
  // This function is called from html when user clicks on make route button
  drawmap() {
    this.DatasharingProviderService.shareMode = 'route'
    this.DatasharingProviderService.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.DatasharingProviderService.map,
      panel: document.getElementById('right-panel')
    });
    // Remove the action listener functionallity from map
    this.DatasharingProviderService.addwaypoint = false;
    // hide draw path button
    this.DatasharingProviderService.drawPath = false;
    // Remove all check Points
    this.DatasharingProviderService.checkPoints = [];
    var arr = [];
    var obj = { 'name': '', 'waypoint': [] };
    obj.name = "Route";
    this.selectedWayPoint = this.DatasharingProviderService.selectedWayPoint;
    obj.waypoint = this.selectedWayPoint;
    // Make object which contain all the waypoint in route and name for route which is Dummy for now
    // Push object to service variable which contains all routes
    this.DatasharingProviderService.route.push(obj)
    for (var i = 1; i < this.selectedWayPoint.length - 1; i++) {
      var objTemp = { 'location': this.selectedWayPoint[i] };
      arr.push(objTemp);
    }
    this.DatasharingProviderService.wayPointToBeAddedInRoute.waypoint = this.DatasharingProviderService.selectedWayPoint;
    this.DatasharingProviderService.routeToBeShare = this.selectedWayPoint;
    this.displayRoute(this.selectedWayPoint[0], this.selectedWayPoint[this.selectedWayPoint.length - 1], this.DatasharingProviderService.directionsService,
      this.DatasharingProviderService.directionsDisplay, arr);
  }
  // open alert box 
  openDialog(): void {
    // using angular material to open Alert box
    let dialogRef = this.dialog.open(ShareModalComponent, {
      width: '550px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {
     // Result from modal comes here
    });
  }
}
