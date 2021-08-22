import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import {map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as config from '../config.js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endPoint = config.endPoint;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  jwt = new JwtHelperService();

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.endPoint + '/users');
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(this.endPoint + '/users/' + id);
  }

  deleteUser(id: number): Observable<string> {
    return this.httpClient.delete<string>(this.endPoint + '/users/' + id);
  }

  registration(username: string, password: string) {
    return this.httpClient.post<any>(this.endPoint + '/users',
      {username, password});
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.endPoint + '/users/login', {username, password})
      .pipe(map(user => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('userId', this.jwt.decodeToken(JSON.stringify(user))['sub']);
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
