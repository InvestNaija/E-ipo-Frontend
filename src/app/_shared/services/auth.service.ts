import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signup$ = new BehaviorSubject<any>(null);

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  landlordStorageKey = 'learning-cp-dashboard-jwt';

  constructor(private router: Router, private http: HttpClient) { }

  setToken(data: any) {
    localStorage.setItem(this.landlordStorageKey, data.token);
    // localStorage.setItem(this.landlordStorageKey + '-expires_at', data.expires_in);
    // localStorage.setItem(this.landlordStorageKey + '-refresh_token', data.refresh_token);
  }

  getToken() {
    return localStorage.getItem(this.landlordStorageKey);
  }

  isLoggedIn() {
    console.log('user is logged in: ', this.getToken() !== '' && this.getToken() !== null && this.getToken() !== 'null' && this.getToken() !== undefined && this.getToken() !== 'undefined');

    return this.getToken() !== '' && this.getToken() !== null && this.getToken() !== 'null' && this.getToken() !== undefined && this.getToken() !== 'undefined';
  }

  logout() {
    // this.http.get('/api/provider/logout', {
    //   headers:
    //     {'Authorization': `Bearer ${this.getToken()}`}
    // }).pipe(
    //   tap(x =>
        localStorage.removeItem(this.landlordStorageKey);
        localStorage.clear();
    //   )
    // ).subscribe(
      // res => {
        // localStorage.removeItem(this.landlordStorageKey + '-expires_at');
        // localStorage.removeItem(this.landlordStorageKey + '-refresh_token');
        this.router.navigate(['/']);
    //   }
    // )
  }
  signUp() {
    return this.signup$.asObservable();
  }
}
