import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
 
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  api: any = environment.api;

  constructor(private http: HttpClient ) { }


  /**
   * Authentication service
   */
   getToken() {
     console.log('Getting CSRF token.');
     return this.http.get( this.api + '/csrf-token/' ).subscribe();
   }

}
