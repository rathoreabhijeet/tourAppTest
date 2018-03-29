import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouteComponentComponent } from './route-component/route-component.component';
import { WaypointComponentComponent } from './waypoint-component/waypoint-component.component';
import { DatasharingProviderService } from './datasharing-provider.service';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { DeleteAlertComponent } from './delete-alert/delete-alert.component'
@NgModule({
  entryComponents: [ShareModalComponent, DeleteAlertComponent],
  declarations: [
    AppComponent,
    RouteComponentComponent,
    WaypointComponentComponent,
    ShareModalComponent,
    DeleteAlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [DatasharingProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
