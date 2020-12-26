import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";

export interface User {
  id?: number;
  userName?: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
// Main api url to call api
  baseURL = 'http://localhost:5000';
  isInit = false;
  isLogout = false;
  isLoggedin = false;
  isSignup = false;
  message = '';
  user: any;
  data: any;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true //this is required so that Angular returns the Cookies received from the server. The server sends cookies in Set-Cookie header. Without this, Angular will ignore the Set-Cookie header
  };


  constructor(private http: HttpClient, private router: Router) {
  }

  init() {
    return this.http.post(`${this.baseURL}/init`, {}, this.httpOptions).subscribe(resp => {
      console.log('AFTER INIT DATA=======>', resp);
      this.isInit = true;
    }, err => {
      this.message = err.error.msg;
      console.log('ERROR OCCURED=====>', this.message);
    });
  }

  login({email, password}) {
    console.log('the body to update: ' + JSON.stringify({email, password}, null, 2));
    return this.http.post(`${this.baseURL}/login`, {email, password}).subscribe(data => {
      this.data = data;
      this.isLoggedin = true;
      this.user = this.data.user;
      console.log('AFTER LOGIN DATA ======>', this.data.user);
      console.log('AFTER LOGIN DATA ======>', this.user);

      this.router.navigate(['books']);

    }, err => {
      this.message = err.error.msg;
      console.log('ERROR OCCURED=====>', this.message);
    });
  }

  logout() {
    return this.http.post(`${this.baseURL}/logout`, {}, this.httpOptions).subscribe(data => {
      this.isLogout = true;
      console.log('AFTER LOGGED OUT =======>', data);
    }, err => {
      this.message = err.error.msg;
      console.log('ERROR OCCURED=====>', this.message);
    });
  }

  signup({name, email, password}) {
    return this.http.post(`${this.baseURL}/signup`, {name, email, password}).subscribe(data => {
      this.isSignup = true;
      console.log('AFFTER SIGNIN ==============>', data);
    }, err => {
      this.message = err.error.msg;
      console.log('ERROR OCCURED=====>', this.message);
    });
  }
}
