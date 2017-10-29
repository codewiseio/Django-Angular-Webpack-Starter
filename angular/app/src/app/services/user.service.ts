import { Observable } from "rxjs/Rx"
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';


import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  api: any = environment.api;

  constructor(private http: HttpClient ) { }


  /**
   * Check if the given email is already registered with another user
   * @param  {string}          email  Email to check
   * @param  {number}          userid ID of user to perform verification against
   * @return {Observable<any>}        Returns true if valid, false if in use
   */
  checkEmailIsRegistered(email: string, userid?: number ): Observable<any> {
	let params = new HttpParams().set('email', email );
	if ( userid )
	 	params = params.set('userid', userid.toString() );

  	return this.http.get(`${this.api}/register/check-email/`, { params: params } );
  }


  /**
   * Register a new user
   * @param  {User}    user The user data for registration
   * @return {Promise}      
   */
  register(user: User): Promise<void | User[]> {

    console.log('Calling register.');

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  	return this.http
  			 .post(`${this.api}/register/`, JSON.stringify(user), { headers: headers } )
             .toPromise()
             .then(response => response as User[])
             .catch(this.handleError);
  }

  /**
   * Sends a password reset link to the supplied email
   * @param  {string}          email Email to send password reset link
   * @return {Observable<any>}       
   */
  resetPassword(email: string): Observable<any> {
  	let params = new HttpParams().set('email', email );
  	return this.http.get(`${this.api}/reset-password/`, { params: params } );
  }


  handleError() {
  	console.log('Handle error here.');
  }

}
