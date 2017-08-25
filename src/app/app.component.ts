import { Component } from '@angular/core';
import { Platform, Events, AlertController, Alert } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  public rootPage: any = HomePage;
  public alertVisible: boolean = false;

  private errorsQueue: Array<any> = [];

  constructor(

    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,

    private events: Events,
    private alertCtrl: AlertController

  ) {

    this
      .platform
      .ready()
      .then(() => {

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();

      });


    // hook up event listners
    this.subcribeEvents();

  }


  private subcribeEvents() {

    // hook to the global (response) error event
    this
      .events
      .subscribe('RESPONSE:ERROR', (error: any) => {

        // add the error to the error queue
        this.errorsQueue.push(error);

        // prompt the current error
        this.handleErrors();

      });

  }

  private handleErrors() {

    // if an error is already presented to the user,
    // the queue handles it after the user clicks OK
    if (this.alertVisible) {
      return;
    }

    // the alert is visible, set the flag to true
    this.alertVisible = true;

    // construct the alert
    let alert: Alert = this.alertCtrl.create({

      title: this.errorsQueue[0].code,
      subTitle: "caught in app.component.ts",
      message: this.errorsQueue[0].message,
      buttons: ["OK"]

    });


    // hook to the dismiss event, and process
    // the errorQueue (if applicable)
    alert
      .onDidDismiss(() => {

        // the current alert is dismissed
        this.alertVisible = false;

        // remove the current error from the queue
        this.errorsQueue.splice(0, 1);

        // if the errorQueue still has errors, show the next error
        if (this.errorsQueue.length !== 0) {

          // recursive call in case of multiple errors
          this.handleErrors();
        }

      });


    // show the alert
    alert
      .present();

  }

}