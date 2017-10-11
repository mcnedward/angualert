import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Alert } from './alert.component';
import { AlertBox } from './alert-box.component';
import { AdDirective } from './ad.directive';
import { AlertService } from './alert.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    Alert,
    AlertBox,
    AdDirective
  ],
  providers: [
    AlertService
  ],
  entryComponents: [Alert],
  bootstrap: []
})
export class AppModule { }
