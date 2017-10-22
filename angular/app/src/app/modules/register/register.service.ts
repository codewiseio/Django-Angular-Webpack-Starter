import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { User } from '../../models/user';

@Injectable()
export class RegisterService {

  constructor(private http: Http) { }


  /**
   * Register a new user
   * @param  {User}    user The user data for registration
   * @return {Promise}      [description]
   */
  register(user: User): Promise<void | User[]> {

  	return this.http
  			 .post('/api/vi/register/', JSON.stringify(user) )
             .toPromise()
             .then(response => response.json().data as User[])
             .catch(this.handleError);
  }


  handleError() {
  	console.log('Handle error here.');
  }

}
