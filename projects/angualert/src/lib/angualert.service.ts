import { Injectable, ComponentFactoryResolver, EventEmitter, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';

import { AngualertComponent } from './angualert.component';
import { AlertOptions } from './alert-options';

/**
 * A service for showing alerts. Inject this into a component constructor, then use it when you want to show an alert.
 * this.alertService.success('Showing the alert was a success!');
 * Note that you need to have an AlertBoxComponent somewhere on your page:
 * <alert-box></alert-box>
 */
@Injectable({
  providedIn: 'root'
})
export class AngualertService implements OnDestroy {
  public locationChanged$: EventEmitter<string>;
  private options: AlertOptions;
  private alerts: AngualertComponent[];
  private sub: SubscriptionLike;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.locationChanged$ = new EventEmitter<string>();
    this.alerts = new Array<AngualertComponent>();
  }

  /**
   * Show an info alert
   * @param message The message for the alert
   * @param options The options. Can be ignored
   */
  public info(message: string, options?: AlertOptions | any) {
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
  public success(message: string, options?: AlertOptions | any): AngualertComponent {
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
  public warn(message: string, options?: AlertOptions | any): AngualertComponent {
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
  public error(message: string, options?: AlertOptions | any): AngualertComponent {
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

  public loadAlert(): AngualertComponent {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(AngualertComponent);

    let viewContainerRef = this.options.adHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);

    let alert = (<AngualertComponent>componentRef.instance);
    this.sub = alert.onDestroy$.subscribe(a => {
      // Completely destory the alert and remove it from the list of active alerts
      componentRef.destroy();
      let index = this.alerts.indexOf(a);
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