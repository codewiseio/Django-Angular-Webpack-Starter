import { Observable } from "rxjs/Rx"
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';


import { User } from '../models/user';
import { environment } from '../../../../environments/environment';

export const TOKEN_NAME: string = 'authToken';

@Injectable()
export class AuthenticationService {

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

    	return this.http.get(`${this.api}/register/validate-email/`, { params: params } );
  }

  login(data: {username: string, password: string} ) {

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http
        .post(`${this.api}/login/`, data, { headers: headers } )
           .toPromise()
           .then(
             (response: any) => {
                // login successful if there's a jwt token in the response
                console.log('Login successful');
                localStorage.setItem('currentUser', JSON.stringify(response));
                localStorage.setItem(TOKEN_NAME,response.token)
                return response as User;
             }
            )
  }


  /**
   * Register a new user
   * @param  {User}    user The user data for registration
   * @return {Promise}      
   */
  register(user: User): Promise<void | User[]> {

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    	return this.http
        .post(`${this.api}/register/`, JSON.stringify(user), { headers: headers } )
           .toPromise()
           .then(response => response as User[])
  }




  /**
   * Sends a password reset link to the supplied email
   * @param  {string}          email Email to send password reset link
   * @return {Observable<any>}       
   */
  resetPasswordRequest(email: string): Observable<any> {
    	let params = new HttpParams().set('email', email );

    	return this.http
        .get(`${this.api}/reset-password/`, { params: params } );
  }

  /**
   * Validate a password reset request. 
   * @param  {string}          key Unique key to validate
   * @return {Observable<any>}     
   */
  validateResetPasswordRequest(key: string): Observable<any> {
    return this.http
        .get(`${this.api}/reset-password/${key}`);
  }


  /**
   * [resetPassword description]
   * @param {string}} data [description]
   */
  resetPassword(key: string, password: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post(`${this.api}/reset-password/${key}/`, {password: password},  { headers: headers } );
  }

  /**
   * Provide the generated account activation key to enable new accounts.
   * @param  {string}          key Key sent to user via email
   * @return {Observable<any>}   
   */
  activateAccount(key: string): Observable<any> {
    return this.http.get(`${this.api}/register/activate/${key}/`);
  }


  handleError() {
  	console.log('Handle error here.');
  }

}
