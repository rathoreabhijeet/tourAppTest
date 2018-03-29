import { Component, OnInit ,Input} from '@angular/core';
import { Route } from '../Route'
import { DatasharingProviderService } from '../datasharing-provider.service'
import { DeleteAlertComponent } from '../delete-alert/delete-alert.component'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_LOCALE, fadeInContent } from '@angular/material';

@Component({
  selector: 'app-route-component',
  templateUrl: './route-component.component.html',
  styleUrls: ['./route-component.component.css']
})
export class RouteComponentComponent implements OnInit {
  // @Input() route: Route;
  route = [];
  showWaypint = [];
  constructor(private DatasharingProviderService: DatasharingProviderService, public dialog: MatDialog) {
    this.route = DatasharingProviderService.route;
   }

  ngOnInit() {
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.DatasharingProviderService.markers.length; i++) {
      this.DatasharingProviderService.markers[i].setMap(map);
    }
  }
  // Function to draw path between points passed to it
  drawPath(wayPoint, index, flag) {
    this.DatasharingProviderService.draginToRoute = true;
    this.DatasharingProviderService.shareMode = 'route'
    this.setMapOnAll(null);
    this.showWaypint = [];
    if (!flag){
      this.showWaypint[index] = true;
    }
    this.DatasharingProviderService.directionsDisplay.setMap(null);
    this.DatasharingProviderService.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.DatasharingProviderService.map,
      panel: document.getElementById('right-panel')
    });
    this.DatasharingProviderService.addwaypoint = false;
    this.DatasharingProviderService.drawPath = false;
    this.DatasharingProviderService.checkPoints = [];
    this.DatasharingProviderService.selectedWayPoint = [];
    // return;
    var arr = [];
    var obj = { 'name': '', 'waypoint': [] };
    obj.name = "Route";
    // this.selectedWayPoint = this.DatasharingProviderService.selectedWayPoint;
    obj.waypoint = wayPoint.waypoint;
    this.DatasharingProviderService.routeToBeShare = wayPoint.waypoint;
    this.DatasharingProviderService.wayPointToBeAddedInRoute = wayPoint;
    // this.DatasharingProviderService.route.push(obj)
    for (var i = 1; i < wayPoint.waypoint.length - 1; i++) {
      var objTemp = { 'location': wayPoint.waypoint[i] };
      arr.push(objTemp);
    }
    this.DatasharingProviderService.displayRoute(wayPoint.waypoint[0], wayPoint.waypoint[wayPoint.waypoint.length - 1], this.DatasharingProviderService.directionsService,
      this.DatasharingProviderService.directionsDisplay, arr);
  }
  addMorePointToRoute(point) { 
    this.setMapOnAll(null);
    this.DatasharingProviderService.directionsDisplay.setMap(null);
    this.DatasharingProviderService.addPointInExistingRoutes = true;
    this.DatasharingProviderService.addwaypoint = true;
    this.DatasharingProviderService.wayPointToBeAddedInRoute = point;
  }
  removeFromPath(waypoint, i,j) { 
    if (waypoint.waypoint.length > 2) {
      waypoint.waypoint.splice(j, 1);
      this.drawPath(waypoint, i, this.showWaypint[i]);
    } else {
      let dialogRef = this.dialog.open(DeleteAlertComponent, {
          width: '550px',
          data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) { 
            this.DatasharingProviderService.route.splice(i, 1);
            this.DatasharingProviderService.directionsDisplay.setMap(null);
          }
        });
      
    }
  
  }
}
