import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { InMemoryDbService, emitResponse, HttpMethodInterceptorArgs, STATUS } from 'angular-in-memory-web-api';


@Injectable()
export class MockDataProvider implements InMemoryDbService {


  // define the endpoints
  public createDb(): {} {

    // api/unauthorized
    let unauthorized = {
      code: `CODE:${STATUS.UNAUTHORIZED}`,
      statusCode: STATUS.UNAUTHORIZED,
      message: "Sorry, you are not authorized!"
    };

    // api/badrequest
    let badrequest = {
      code: `CODE:${STATUS.BAD_REQUEST}`,
      statusCode: STATUS.BAD_REQUEST,
      message: "Things, well... went wrong!"
    };

    // expose the endpoints defined above
    return { unauthorized, badrequest };

  }

}

@Injectable()
export class MockDataProviderExt extends MockDataProvider {


  // intercept get requests
  protected get(interceptorArgs: HttpMethodInterceptorArgs) {

    // return a cold observable (requires a subscribes).
    return new Observable<Response>((responseObserver: Observer<Response>) => {

      const {

        req,
        headers,
        collection

      } = interceptorArgs.requestInfo;

      // construct the a new response. we default to a 404 (resource / endpoint not found)
      // if a collection is found however we update body and status accordingly
      let resOptions: ResponseOptions = new ResponseOptions({

        body: {
          code: `CODE:${STATUS.NOT_FOUND}`,
          statusCode: STATUS.NOT_FOUND,
          message: "Couldn't find what you're looking for."
        },

        headers: headers,
        status: STATUS.NOT_FOUND

      });

      // we have a collection (thus an endpoint)
      if (collection) {

        // update the response accordingly
        resOptions = new ResponseOptions({
          body: collection,
          // inherit the statusCode from the definition
          status: collection['statusCode']
        });

      }

      // emit the response
      emitResponse(responseObserver, req, resOptions);

      // unsubscribe function
      return () => { };

    });

  }


}