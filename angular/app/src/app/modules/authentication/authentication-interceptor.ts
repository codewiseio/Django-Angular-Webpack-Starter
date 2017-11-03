
import {DOCUMENT, ɵparseCookieValue as parseCookieValue} from '@angular/common';
import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse, HttpInterceptor} from '@angular/common/http';

const TOKEN_NAME: string = 'authToken';
const AUTH_HEADER_KEY: string = 'Authorization';
const AUTH_PREFIX: string = 'Bearer';

/**
 * Adds authentication token to headers on all requests
 */
@Injectable()

export class AuthenticationInterceptor implements HttpInterceptor {

  cachedRequests: Array<HttpRequest<any>> = [];

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(TOKEN_NAME);

    // attach token to header being careful not to over-write header of same name
    if (token !== null && !req.headers.has('Authentication')) {
      req = req.clone({headers: req.headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`)});
    }

    // look out for 401 Unauthorized responses to signify expired tokens
    return next.handle(req).do(

	    (event: HttpEvent<any>) => {
	      if (event instanceof HttpResponse) {
	        // do stuff with response if you want
	      }
	    },

		(response: any) => {
			if (response instanceof HttpErrorResponse && response.status === 401) {
				if (response.status === 401 ) {
					console.log(response);
					if ( response.error.detail === "Signature has expired.") {
						this.collectFailedRequest(req);
					}
				  // redirect to the login route 
				  // or show a modal
				}
			}
		}
    );
  }


	public collectFailedRequest(request: HttpRequest<any>): void {
		this.cachedRequests.push(request);
	}
	public retryFailedRequests(): void {
		// retry the requests. this method can
		// be called after the token is refreshed
	}
}
