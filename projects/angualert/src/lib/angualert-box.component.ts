import { Component, ViewChild, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { AngualertService } from './angualert.service';
import { AdDirective } from './ad.directive';
import { AlertOptions } from './alert-options';

/**
 * A component for containing all the alerts on a page.
 * To use the Alerts, add the AngualertBoxComponent to the base page, or to the page you want to use alerts on.
 * <angualert-box></angualert-box>
 */
@Component({
  selector: 'angualert-box',
  template: `
  <div id="alertContainer" [ngClass]="'alert-' + location">
    <ng-template ad-host></ng-template>
  </div>`,
  styleUrls: ['./angualert-box.component.scss']
})
export class AngualertBoxComponent implements OnInit {
  @ViewChild(AdDirective) adHost: AdDirective;
  @Input() location: string;
  @Input() autoClose: boolean;
  @Input() autoCloseTimeout: number;
  @Input() options: AlertOptions;
  @Output() alertConfirmed: EventEmitter<boolean> = null;

  constructor(private angualertService: AngualertService, private cdr: ChangeDetectorRef) {
    angualertService.locationChanged$.subscribe(location => this.location = location);
  }

  ngOnInit() {
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
