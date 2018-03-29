import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatasharingProviderService } from '../datasharing-provider.service'
@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css']
})
export class ShareModalComponent {
  DummyDriver = [
    { name: "Curtis Gomez", email: "curtisgomez@chatmail.com" },
    { name: "Romain Gomez", email: "romaingomez@chatmail.com" },
    { name: "Gersitho Cruz", email: "gersithoCruz@chatmail.com" },
    { name: "Gaurav Jaiswal", email: "GauravJaiswal@chatmail.com" },
    { name: "Klara Ali", email: "KlaraAli@chatmail.com" },
    { name: "Zute Bhati", email: "ZuteBhati@chatmail.com" },
    { name: "Mohhamad Delwar", email: "MohhamadDelwar@chatmail.com" },
    { name: "Mark Adam", email: "MarkAdam@chatmail.com" },
    { name: "Ronaldo Adam", email: "RonaldoAdam@chatmail.com" },
    { name: "Messi Football", email: "MessiFootball@chatmail.com" },
    { name: "Anil Dinkar", email: "AnilDinkar@chatmail.com" },
  ]
  constructor(
    public dialogRef: MatDialogRef<ShareModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private DatasharingProviderService: DatasharingProviderService) { }

  ngOnInit() {
  }
  onNoClick(): void {
    if (this.DatasharingProviderService.shareMode == 'waypoint') {
      var url = 'https://www.google.com/maps/search/?api=1&query=' + this.DatasharingProviderService.latlngToBeShare;
    }
    else { 
      var url = 'https://www.google.com/maps/dir/?api=1&origin=' + this.DatasharingProviderService.routeToBeShare[0] + '&destination=' + this.DatasharingProviderService.routeToBeShare[this.DatasharingProviderService.routeToBeShare.length - 1] + '&travelmode=driving&waypoints='
      for (var i = 1; i < this.DatasharingProviderService.routeToBeShare.length - 1; i++) { 
        url = url + this.DatasharingProviderService.routeToBeShare[i] + ','
      }
    }
    window.open(url, '_blank');
    this.dialogRef.close();
  }

}
