import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ConnectionService } from 'ng-connection-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private toastr: ToastrService,
    private cxnService: ConnectionService
    ) { }

  get(url: string, useToken: boolean = true): Observable<any> {
    return this.request('GET', url, useToken);
  }

  post(url: string, body: Object, useToken: boolean = true): Observable<any> {
    return this.request('POST', url, useToken, body);
  }

  postFormData(url: string, formData: Object): Observable<any> {
    let headers = new HttpHeaders().append('Authorization', `${this.auth.getToken()}`);
    return this.http.post(url, formData, {headers});
  }

  put(url: string, body: Object, useToken: boolean = true): Observable<any> {
    return this.request('PUT', url, useToken, body);
  }
  patch(url: string, body: Object, useToken: boolean = true): Observable<any> {
    return this.request('PATCH', url, useToken, body);
  }

  delete(url: string, useToken: boolean = true): Observable<any> {
    return this.request('DELETE', url, useToken);
  }

  request(method: string, url: string, useToken: boolean, body?: Object) {
    let headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', `${this.auth.getToken()}`);

    if (!useToken) {
      headers = headers.delete('Authorization');
    }

    const options = {
      body,
      headers,
    }

    console.log( 'About to check cxn' );
    this.cxnService.monitor().subscribe(isConnected => {

      console.log( 'Checking cxn' );

      console.log( isConnected );
      // if (this.isConnected) {
      //   this.noInternetConnection=false;
      // }
      // else {
      //   this.noInternetConnection=true;
      // }
    })

    const endpoint = environment.apiUrl + url
    return this.http.request(method, endpoint, options)
      .pipe(catchError((error: HttpErrorResponse) => this.onRequestError(error)));
  }

  onRequestError(error: HttpErrorResponse) {

    if (error.status === 401) {
      console.log(error.statusText, error.status +': Server Error');
      this.toastr.error('Your session has timed out', 'Authentication Error');
      this.auth.logout();
    }
    if (error.status >= 500 && error.status < 600) {
      console.log(error.statusText, error.status +': Server Error');
      this.toastr.error(error.statusText, error.status +': Server Error');
      return throwError(error);
    }

    return throwError(error);
  }
}
