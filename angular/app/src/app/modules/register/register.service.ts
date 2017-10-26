import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
 
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

@Injectable()
export class RegisterService {

  api: any = environment.api;

  constructor(private http: HttpClient) { }


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
   * Checks to see if an email is already registered
   * @param  {string}  email Email address to verify
   * @return {Promise}      
   */
  // checkEmailIsRegistered(email: string): Promise<void| boolean> {
  //   let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
  //   return this.http
  //        .post(`${this.api}/check-email/`, email, { headers: headers } )
  //            .toPromise()
  //            .then(response => response as User[])
  //            .catch(this.handleError);    
  // }



  handleError() {
  	console.log('Handle error here.');
  }

}
