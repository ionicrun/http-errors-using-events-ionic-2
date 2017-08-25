import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, Response } from "@angular/http";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  constructor(

    private http: Http,
    private events: Events

  ) { }


  // perform two HTTP calls, which both
  // throw different errors
  public multipleErrors() {

    this
      .http
      .get("api/badrequest")
      .subscribe(
        (res: Response) => { },
        (error: any) => {
          this.publishError(error);
        }
      );

    this.singleError();

  }


  public singleError() {
    
    this
    .http
    .get("api/unauthorized")
    .subscribe(
      (res: Response) => { },
      (error: any) => {
        this.publishError(error);
      }
    );

  }


  // publish the error response event
  private publishError(error) {

    this
      .events
      .publish('RESPONSE:ERROR', error.json());

  }

}
