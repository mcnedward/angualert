import { Component, ViewChild, Input, Output, AfterViewInit, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { AngualertService } from '../angualert.service';
import { AdDirective } from '../ad.directive';
import { AlertOptions } from './alert-options';

/**
 * A component for containing all the alerts on a page.
 * To use the Alerts, add the AlertBox to the base page, or to the page you want to use alerts on.
 * <alert-box></alert-box>
 */
@Component({
  selector: 'alert-box',
  template: `
  <div id="alertContainer" [ngClass]="'alert-' + location">
    <ng-template ad-host></ng-template>
  </div>`,
  styleUrls: ['./alert-box.component.scss']
})
export class AlertBoxComponent implements AfterViewInit {
  @ViewChild(AdDirective) adHost: AdDirective;
  @Input() location: string;
  @Input() autoClose: boolean;
  @Input() autoCloseTimeout: number;
  @Input() options: AlertOptions;
  @Output() alertConfirmed: EventEmitter<boolean> = null;

  constructor(private angualertService: AngualertService,
    private cdr: ChangeDetectorRef) {
    angualertService.locationChanged$.subscribe(location => this.location = location);
  }

  ngAfterViewInit() {
    // Get any options defined in directive html
    let options = {
      adHost: this.adHost,
      location: this.location,
      autoClose: this.autoClose,
      autoCloseTimeout: this.autoCloseTimeout,
      alertConfirmed: this.alertConfirmed
    };
    // Combine options
    this.options = new AlertOptions(this.options, options);

    if (this.location !== this.options.location) {
      this.location = this.options.location;
      this.cdr.detectChanges();
    }

    this.angualertService.register(this.options);
  }
}
