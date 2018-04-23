import { TestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions, XHRBackend } from '@angular/http';
import { HttpClient, HttpClientModule, HttpParams, HttpResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { MockBackend } from '@angular/http/testing';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../../environments/environment';


describe('AuthenticationService', () => {

  beforeEach( () => {
      TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            HttpClientTestingModule
        ],
        providers: [
          AuthenticationService
        ]
      });
  });

  describe('validateEmail()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // execute 
            service.validateEmail('test@example.com').subscribe();

            // validate
            backend.expectOne((req: HttpRequest<any>) => {
              const body = new HttpParams({ fromString: req.body });

              return req.url === '/api/v1/authentication/email/'
                && req.method === 'GET'
                && req.params.get('email') === 'test@example.com';
            }, `POST to 'api/v1/authentication/' with email and password`);


        }) // end inject
      ) // end async
    ); // end it
  }); // end describe

  describe('login()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.login('test@example.com', 'password').then();

            backend.expectOne((req: HttpRequest<any>) => {
              const body = new HttpParams({ fromString: req.body });

              return req.url === '/api/v1/authentication/'
                && req.method === 'POST'
                && req.body.email === 'test@example.com'
                && req.body.password === 'password';
            }, `POST to 'api/v1/authentication/' with email and password`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('register()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            let newUser = {
              email: 'test@example.com',
              password: 'password'
            };

            // validate email
            service.register(newUser).then();

            backend.expectOne((req: HttpRequest<any>) => {

              return req.url === '/api/v1/users/'
                && req.method === 'POST'
                && req.body.email === 'test@example.com'
                && req.body.password === 'password';
            }, `POST to '/api/v1/users/' with email and password`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('resetPasswordRequest()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.resetPasswordRequest('test@example.com').subscribe();

            backend.expectOne((req: HttpRequest<any>) => {
              const body = new HttpParams({ fromString: req.body });
              return req.url === '/api/v1/authentication/password/'
                && req.method === 'POST'
                && req.body.email === 'test@example.com';
            }, `POST to '/api/v1/authentication/password/' with email`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('validatePasswordRequest()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.validateResetPasswordRequest('RESETPASSWORDKEY').subscribe();

            backend.expectOne((req: HttpRequest<any>) => {
              const body = new HttpParams({ fromString: req.body });
              return req.url === '/api/v1/authentication/password/RESETPASSWORDKEY/'
                && req.method === 'GET';
            }, `GET to '/api/v1/authentication/password/RESETPASSWORDKEY/'`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('resetPassword()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.resetPassword('RESETPASSWORDKEY', 'newpassword').subscribe();

            backend.expectOne((req: HttpRequest<any>) => {
              const body = new HttpParams({ fromString: req.body });
              return req.url === '/api/v1/authentication/password/RESETPASSWORDKEY/'
                && req.method === 'PATCH'
                && req.body.password === 'newpassword';
            }, `POST to '/api/v1/authentication/password/' with email`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('activateAccount()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.activateAccount('ACTIVATIONKEY').subscribe();

            backend.expectOne((req: HttpRequest<any>) => {

              return req.url === '/api/v1/authentication/'
                && req.method === 'PATCH'
                && req.body.key === 'ACTIVATIONKEY';
            }, `PATCH to '/api/v1/authentication/' with 'ACTIVATIONKEY'`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe


  describe('modifyCredentials()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.modifyCredentials(1, {email: 'new@example.com', confirm_password: 'password'}).then();

            backend.expectOne((req: HttpRequest<any>) => {

              return req.url === '/api/v1/users/1/'
                && req.method === 'PATCH'
                && req.body.email === 'new@example.com'
                && req.body.confirm_password === 'password';
            }, `PATCH to '/api/v1/users/1/' with email and confirm_password`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe

  describe('modifyCredentials()', () => {
    it('should return an Observable<any>',
      async(
        inject(
          [AuthenticationService, HttpTestingController], 
          (service: AuthenticationService, backend: HttpTestingController) => {
       
            // validate email
            service.modifyCredentials(1, {password: 'newpassword', confirm_password: 'password'}).then();

            backend.expectOne((req: HttpRequest<any>) => {

              return req.url === '/api/v1/users/1/'
                && req.method === 'PATCH'
                && req.body.password === 'newpassword'
                && req.body.confirm_password === 'password';
            }, `PATCH to '/api/v1/users/1/' with password and confirm_password`);

        }) // end inject
      ) // end async
    ); // end it
  }); // end describe

});
