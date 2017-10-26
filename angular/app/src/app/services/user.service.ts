import { Observable } from "rxjs/Rx"
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';

 
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  api: any = environment.api;

  constructor(private http: HttpClient ) { }


  checkEmailIsRegistered(email: string, userid?: number ): Observable<any> {
	let params = new HttpParams().set('email', email );
	if ( userid )
	 	params = params.set('userid', userid.toString() );

  	return this.http.get(`${this.api}/register/check-email/`, { params: params } );
  }

}
