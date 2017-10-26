import {DOCUMENT, ɵparseCookieValue as parseCookieValue} from '@angular/common';
import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpInterceptor, HttpXsrfTokenExtractor } from '@angular/common/http';

/**
 * `HttpInterceptor` which adds an XSRF token to eligible outgoing requests.
 */
@Injectable()

export class DevHttpXsrfInterceptor implements HttpInterceptor {

  constructor(
      private tokenService: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lcUrl = req.url.toLowerCase();
    // console.log('intercepting');
    // console.log(lcUrl);


    // console.log(req.headers);

    // if request is "GET" or "HEAD" retrieve the X-SRF token from the cookie
    // supplied by the server
    // if (req.method === 'GET' || req.method === 'HEAD') {
    //   return next.handle(req).map( (event: HttpResponse<any>) => {
    //       // here I want to read the "Set-Cookie" header and extract XSRF-TOKEN for later use
    //       console.log('--Response--');
    //       console.log(event);
    //       console.log(event.headers); // headers is empty
    //       // console.log(event.headers.keys())
    //       // uncommenting this line throws an error "Cannot read property 'get' of undefined"
    //       // console.log(event.headers.get('Set-Cookie'));
    //       return event;
    //   });
    // }
    // const token = this.tokenService.getToken();

    // // Be careful not to overwrite an existing header of the same name.
    // if (token !== null && !req.headers.has('X-XSRF-TOKEN')) {
    //   req = req.clone({headers: req.headers.set('X-XSRF-TOKEN', token)});
    // }
    return next.handle(req);
  }
}