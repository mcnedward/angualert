import { Component, EventEmitter } from '@angular/core';

import { AngualertService, AlertOptions } from 'angualert';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public alertText: string = `Whatever you type here will show up in the alert. Give it a try! Then hit one of the buttons below to pop the alert.`;
  public alertMaxLength: number = 500;
  public options: AlertOptions;
  public copyrightDate: number = new Date().getFullYear();

  constructor(private alertService: AngualertService) {
    this.options = new AlertOptions();
  }

  public showInfo() {
    this.alertService.info(this.alertText, this.options);
  }
  public showSuccess() {
    this.alertService.success(this.alertText, this.options);
  }
  public showWarn() {
    this.alertService.warn(this.alertText, this.options);
  }
  public showError() {
    this.alertService.error(this.alertText, this.options);
  }

  public showConfirm() {
    const e = new EventEmitter<boolean>();
    e.subscribe(v => {
      const wasConfirmed = v ? 'Yes' : 'No';
      this.alertService.success('Was alert confirmed? ' + wasConfirmed);
    });
    const options = new AlertOptions();
    options.alertConfirmed = e;
    options.adHost = this.options.adHost;

    this.alertService.info(this.alertText, options);
  }

  alertLength(): number {
    let length = this.alertText ? this.alertText.length : 0;
    if (!length) {
      length = 0;
    }
    return length;
  }
}
