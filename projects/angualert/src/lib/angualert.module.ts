import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AngualertComponent } from './angualert.component';
import { AngualertBoxComponent } from './angualert-box.component';
import { AdDirective } from './ad.directive';

@NgModule({
  declarations: [
    AngualertComponent,
    AngualertBoxComponent,
    AdDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    AngualertComponent,
    AngualertBoxComponent,
    AdDirective
  ],
  entryComponents: [AngualertComponent]
})
export class AngualertModule {}
