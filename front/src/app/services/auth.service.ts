import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../core/token.storage';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient, private storage: TokenStorage) {}

  attemptAuth(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post(this.baseUrl + 'login', credentials);
  }

  get token() {
    return this.storage.getToken();
  }

  isLoggedIn() {
    return !!this.token;
  }

  logout() {
    this.storage.removeToken();
  }
}
