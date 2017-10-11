import { Injectable, ComponentFactoryResolver, EventEmitter, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { Alert } from './alert.component';
import { AlertOptions } from './alert-options';

/**
 * A service for showing alerts. Inject this into a component constructor, then use it when you want to show an alert.
 * this.alertService.success('Showing the alert was a success!');
 * Note that you need to have an AlertBoxComponent somewhere on your page:
 * <alert-box></alert-box>
 */
@Injectable()
export class AlertService implements OnDestroy {
  public locationChanged$: EventEmitter<string>;
  private options: AlertOptions;
  private alerts: Alert[];
  private sub: ISubscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.locationChanged$ = new EventEmitter<string>();
    this.alerts = new Array<Alert>();
  }

  /**
   * Show an info alert
   * @param message The message for the alert
   * @param options The options. Can be ignored
   */
  public info(message: string, options?: AlertOptions | any): Alert {
    let alert = this.loadAlert();
    options = this.getOptions(options);
    alert.info(message, options);
    return alert;
  }

  /**
   * Show an success alert
   * @param message The message for the alert
   * @param options The options. Can be ignored
   */
  public success(message: string, options?: AlertOptions | any): Alert {
    let alert = this.loadAlert();
    options = this.getOptions(options);
    alert.success(message, options);
    return alert;
  }

  /**
   * Show a warn alert
   * @param message The message for the alert
   * @param options The options. Can be ignored
   */
  public warn(message: string, options?: AlertOptions | any): Alert {
    let alert = this.loadAlert();
    options = this.getOptions(options);
    alert.warn(message, options);
    return alert;
  }

  /**
   * Show an error alert
   * @param message The message for the alert
   * @param options The options. Can be ignored
   */
  public error(message: string, options?: AlertOptions | any): Alert {
    let alert = this.loadAlert();
    options = this.getOptions(options);
    alert.error(message, options);
    return alert;
  }

  /**
   * Gets the correct options to use for an alert.
   * Checks if the location for the alerts has changed. If it has, then the locationChanged$ event must be emitted so the AlertBox can know to update the location.
   * @param options The AlertOptions
   */
  private getOptions(options?: AlertOptions | any): AlertOptions {
    options = new AlertOptions(options, this.options);

    if (options.location !== this.options.location) {
      this.locationChanged$.emit(options.location); // For the AlertBox
      this.options.location = options.location;

      // Sync the locations for all alerts
      for (let alert of this.alerts) {
        alert.setLocation(options.location);
      }
    }
    return options;
  }

  public loadAlert(): Alert {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(Alert);

    let viewContainerRef = this.options.adHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);

    let alert = (<Alert>componentRef.instance);
    this.sub = alert.onDestroy$.subscribe(alert => {
      // Completely destory the alert and remove it from the list of active alerts
      componentRef.destroy();
      let index = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
    });
    this.alerts.push(alert);
    return alert;
  }

  /**
   * Register the AlertOptions.
   * @param options The options for the alert
   */
  public register(options: AlertOptions) {
    this.options = options;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}