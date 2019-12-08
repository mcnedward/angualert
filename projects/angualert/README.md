# Angualert

A service for popping alerts in an Angular app.

## Demo

[View the demo](https://angualert.edwardmcnealy.com/)

## Using in your app

`npm install angualert`

Add the following to your `AppModule`:

```js
import { AngualertModule } from 'angualert';

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    AngualertModule
  ],
  providers: [],
  bootstrap: [
    // ...
  ]
})
export class AppModule { }
```

You can then inject the `AngualertService` and use it to start showing alerts.

```js
import { AngualertService, AlertOptions } from 'angualert';

export class AppComponent {

  constructor(private angualertService: AngualertService) {
  }

  showInfo() {
    this.angualertService.info('This is an info level message!');
  }

  showError() {
    this.angualertService.error('This is an error level message...');
  }

  showSuccessWithOptions() {
    const options = new AlertOptions();
    options.location  = 'center';
    options.autoCloseTimeout = 10000;
    this.angualertService.info('This is an alert centered and auto-closing in 10 seconds!', options);
  }

  showWithConfirm() {
    const e = new EventEmitter<boolean>();
    e.subscribe(v => {
      const wasConfirmed = v ? 'Yes' : 'No';
      this.alertService.success('Was alert confirmed? ' + wasConfirmed);
    });
    const options = new AlertOptions();
    options.alertConfirmed = e;

    this.angualertService.info('This is an alert with 2 confirmation buttons!', options);
  }

}
```

## Alert Types

### Info
`this.angualertService.info('This is blue info');`

### Success
`this.angualertService.success('This is green success');`

### Warn
`this.angualertService.warn('This is yellow warning');`

### Error
`this.angualertService.error('This is red error');`

## Alert Options

### Location
| Option | Values | Description |
| ------ | ------ | ----------- |
| location | string: left \| right \| center | Position for where the alerts will be shown |
| autoClose | boolean | True if the alerts should close automatically, false if they should only be closed on click |
| autoCloseTimeout | number | The time in milliseconds until an alert is auto-closed |
| alertConfirmed | EventEmitter<boolean> | An event emitter that will receive a boolean value determining if the alert was confirmed or not |
