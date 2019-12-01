import { EventEmitter } from '@angular/core';
import { AdDirective } from '../ad.directive';

/**
 * The options for an Alert
 * location: left|center|right
 */
export class AlertOptions {
  adHost: AdDirective;
  location: string = 'right';
  autoClose: boolean = true;
  autoCloseTimeout: number = 4000;
  alertConfirmed: EventEmitter<boolean> = null; // Callback function

  constructor(options?: any, defaultOptions?: any) {
    // First merge the defaultOptions with the defaults defined in this class
    let d = this.merge(defaultOptions, {
      adHost: this.adHost,
      location: this.location,
      autoClose: this.autoClose,
      autoCloseTimeout: this.autoCloseTimeout,
      alertConfirmed: this.alertConfirmed
    });

    // Then merge the passed in options with the new defaults
    let o = this.merge(options, d);

    // Finally, assign the new options
    this.adHost = o.adHost;
    this.location = o.location;
    this.autoClose = o.autoClose;
    this.autoCloseTimeout = o.autoCloseTimeout;

    if (o.alertConfirmed) {
      if (typeof (o.alertConfirmed) === 'function') {
        this.alertConfirmed = new EventEmitter<boolean>();
        this.alertConfirmed.subscribe((confirmed) => {
          o.alertConfirmed(confirmed);
        });
      } else {
        this.alertConfirmed = o.alertConfirmed;
      }
    } else {
      this.alertConfirmed = d.alertConfirmed;
    }
  }

  private merge(options: any, defaultOptions: any) {
    options = options || {};
    defaultOptions = defaultOptions || {};

    return {
      adHost: options.adHost || defaultOptions.adHost,
      location: options.location || defaultOptions.location,
      autoClose: options.autoClose != null ? options.autoClose : defaultOptions.autoClose,
      autoCloseTimeout: options.autoCloseTimeout || defaultOptions.autoCloseTimeout,
      alertConfirmed: options.alertConfirmed || defaultOptions.alertConfirmed
    };
  }
}
