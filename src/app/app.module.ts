import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { AlertBoxComponent } from './alert/alert-box.component';
import { AlertDemoComponent } from './alert-demo/alert-demo.component';
import { AdDirective } from './ad.directive';

import { AngualertService } from './angualert.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AlertBoxComponent,
    AlertDemoComponent,
    AdDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [AngualertService],
  entryComponents: [AlertComponent, AlertDemoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
