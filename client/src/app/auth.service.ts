import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';

const BACKEND_URL = 'http://localhost:5000/';

export interface User {
  id?: number;
  name?: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private name: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  public err = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private router: Router) {
  }
  getUser() {
    return this.name;
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  login(email: string, password: string) {
    const authData: User = {email, password};
    this.http
      .post<{ user: string, token: string; expiresIn: number, userId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(response => {

          this.err.next(null);
          console.log('responce from login ===>', response);
          const token = response.token;
          this.token = token;
          this.name = response.user;

          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

            this.saveAuthData(this.name, token, expirationDate, this.userId);
            this.router.navigate(['/books']);
          }
        },
        err => {
          this.err.next(err);
          console.log(err);
        });
  }


  signup(name: string, email: string, password: string) {
    const authData: User = {name, email, password};
    this.http
      .post(BACKEND_URL + 'signup', authData)
      .subscribe(response => {
          console.log('responce from signin ===>', response);
          this.err.next(null);
          this.router.navigate(['/login']);

        },
        err => {
          this.err.next(err);
          console.log(err);
        });
  }

  getAllUsers() {
    return this.http.get<{ users: any, message: string }>
    (BACKEND_URL + 'books');
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }


  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.name = authInformation.name;
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      name,
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }


  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(name: string, token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }


  private clearAuthData() {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

}
