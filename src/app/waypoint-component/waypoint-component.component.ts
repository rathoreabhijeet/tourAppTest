import { Component, OnInit, Input } from '@angular/core';
import { WayPoint } from '../wayPoint';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { DatasharingProviderService } from '../datasharing-provider.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_LOCALE, fadeInContent } from '@angular/material';
import { } from '@types/googlemaps';
@Component({
  selector: 'app-waypoint-component',
  templateUrl: './waypoint-component.component.html',
  styleUrls: ['./waypoint-component.component.css']
})
export class WaypointComponentComponent implements OnInit {
  WayPoint = [];
  addWaypointDiv = false;
  checkedWaypoint = [];
  checkPoints = [];
  constructor(private DatasharingProviderService: DatasharingProviderService) {
    this.WayPoint = this.DatasharingProviderService.waypoint;
  }

  ngOnInit() {
  }
  showAddWayPointDiv(temp) {
    this.setMapOnAll(null);
    this.DatasharingProviderService.drawPath = false;
    this.DatasharingProviderService.selectedWayPoint = [];
    this.DatasharingProviderService.checkPoints = [];
    this.DatasharingProviderService.directionsDisplay.setMap(null);
    this.addWaypointDiv = temp;
    this.DatasharingProviderService.addwaypoint = this.addWaypointDiv;
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.DatasharingProviderService.markers.length; i++) {
      this.DatasharingProviderService.markers[i].setMap(map);
    }
  }
  drag(ev, waypoint) {
    this.DatasharingProviderService.locationToBeDrag = waypoint;
  }

  wayPointSelected(i) {
  
    this.DatasharingProviderService.addwaypoint = false;
    this.setMapOnAll(null);
    this.DatasharingProviderService.directionsDisplay.setMap(null);
    var alreadyexistIndex = this.DatasharingProviderService.selectedWayPoint.indexOf(this.DatasharingProviderService.waypoint[i]);
    if (alreadyexistIndex == -1) {
      this.DatasharingProviderService.latlngToBeShare = this.DatasharingProviderService.waypoint[i];
      this.DatasharingProviderService.selectedWayPoint.push(this.DatasharingProviderService.waypoint[i]);
      this.drawMarkers();
    } else {
      this.DatasharingProviderService.selectedWayPoint.splice(alreadyexistIndex, 1);
      this.drawMarkers();
    }
    if (this.DatasharingProviderService.selectedWayPoint.length > 1) {
      this.DatasharingProviderService.drawPath = true;
    } else {
      this.DatasharingProviderService.drawPath = false;;
    }
    if (this.DatasharingProviderService.selectedWayPoint.length == 1) {
      this.DatasharingProviderService.shareMode = 'waypoint'
    } else { 
      this.DatasharingProviderService.shareMode = undefined;
    }
  }
  
  drawMarkers() { 
    this.DatasharingProviderService.addwaypoint = false;
    var _this = this;
    for (var index = 0; index < this.DatasharingProviderService.selectedWayPoint.length; index++) {
      this.DatasharingProviderService.geocoder.geocode({ 'address': this.DatasharingProviderService.selectedWayPoint[index] }, function (results, status) {
        if (results && results[0] && results[0].geometry && results[0].geometry.location) {
          _this.DatasharingProviderService.map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: _this.DatasharingProviderService.map,
            position: results[0].geometry.location
          });
          _this.DatasharingProviderService.markers.push(marker);
        } else { 
          alert('Could not put all the markers you have requsted directions due to: Error');
        }
      });
    }
  }
}
