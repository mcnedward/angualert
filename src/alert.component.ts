import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { AlertOptions } from './alert-options';

/**
 * A component for handling an alert. Use the AlertService to create and show alerts.
 */
@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.css'],
  animations: [
    trigger('enterLeave', [
      state('topToDown', style({ transform: 'translateY(0)' })),
      transition('* => topToDown', [
        animate(300, keyframes([
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(12px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
        ]))
      ]),
      state('rightOut', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('topToDown => rightOut', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.2 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
      state('leftOut', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('topToDown => leftOut', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(15px)', offset: 0.2 }),
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ]),
      state('centerOut', style({ opacity: 0, transform: 'translateY(100%)' })),
      transition('topToDown => centerOut', [
        animate(300, keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(12px)', offset: 0.2 }),
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class Alert {
  @Input() alertType: string = 'info';
  @ViewChild('progressElement') progressElement: ElementRef;
  @Output() alertConfirmed: EventEmitter<boolean> = null;
  public onDestroy$: EventEmitter<Alert>; // Reference to itself, so it can be destroyed
  public alertMessage: string;
  public location: string;
  public autoCloseTimeout: number;  // Auto close alert in 4 seconds
  public visible: boolean;
  public progress: number = 0; // The progress for the alert auto close
  // public alertConfirmed: any; // Function for on confirm
  private currentTime: number = 0;
  private intervalLoopTime: number; // How often to run the loop
  private progressStep: number; // How much progress to increment
  private token;  // Token for the progress interval loop
  private pause: boolean = false; // Pause the timer for when alert is focused
  private alertState: string;
  private alertStateBase: string = 'topToDown';

  constructor() {
    this.onDestroy$ = new EventEmitter<Alert>();
    this.progress = 0;
    this.currentTime = 0;
    this.autoCloseTimeout = 4000;
    this.intervalLoopTime = 20;
  }

  public info(message: string, options: AlertOptions) {
    this.show(message, 'info', options);
  }
  public success(message: string, options: AlertOptions) {
    this.show(message, 'success', options);
  }
  public warn(message: string, options: AlertOptions) {
    this.show(message, 'warn', options);
  }
  public error(message: string, options: AlertOptions) {
    this.show(message, 'error', options);
  }

	/**
	 * Close the alert.
	 */
  public close() {
    this.alertState = `${this.location}Out`;
    // Set to invisible after 305ms (after the animation transition is complete)
    setTimeout(() => {
      this.visible = false;
      this.onDestroy$.emit(this); // Let the AlertService know to destroy this Alert
    }, 305);
  }

  public setLocation(location: string) {
    this.location = location;
  }

  public mouseenter() {
    this.pause = true;
  }
  public mouseleave() {
    this.pause = false;
  }

  public confirm(confirmed: boolean) {
    if (this.alertConfirmed == null) {
      this.alertMessage = 'Sorry, no callback setup for confirmation.';
      this.alertType = 'error';
      this.currentTime = 0;
      this.progress = 0;
      return;
    }
    this.alertConfirmed.emit(confirmed);
    this.close();
  }

	/**
	 * Shows the alert.
	 * @param message The message to display in the alert
	 * @param type The type of alert: info, success, warn, error
	 * @param location The location of the alert on screen: left, middle, right
	 */
  private show(message: string, type: string, options: AlertOptions) {
    this.alertMessage = message;
    this.alertType = type;
    this.location = options.location;
    
    if (options.alertConfirmed != null) {
      this.alertConfirmed = options.alertConfirmed;
    } else {
      this.alertConfirmed == null;
    }

    this.autoCloseTimeout = options.autoCloseTimeout;
    this.progressStep = 100 / (this.autoCloseTimeout / this.intervalLoopTime);

    this.visible = true;
    this.alertState = this.alertStateBase;

    if (options.autoClose && this.alertConfirmed == null) {
      this.token = setInterval(() => this.renderProgress(), this.intervalLoopTime);
    }
  }

  private renderProgress() {
    if (!this.pause) {
      this.currentTime += this.intervalLoopTime;
      this.progress += this.progressStep;
    }
    if (this.currentTime >= this.autoCloseTimeout) {
      this.close();
      clearTimeout(this.token);
    }
  }
}