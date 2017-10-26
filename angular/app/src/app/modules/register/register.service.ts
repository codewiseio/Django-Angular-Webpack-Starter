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
   * @return {Promise}      [description]
   */
  register(user: User): Promise<void | User[]> {

    console.log('Calling register.');

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Angular 4 is kind of a pain....');

  	return this.http
  			 .post(`${this.api}/register/`, JSON.stringify(user), { headers: headers } )
             .toPromise()
             .then(response => response as User[])
             .catch(this.handleError);
  }


  handleError() {
  	console.log('Handle error here.');
  }

}
