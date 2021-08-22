import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Group } from '../models/Group';
import * as config from '../config.js';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  endPoint = config.endPoint;

  constructor(private httpClient: HttpClient) {
  }

  getGroups(creatorId: number): Observable<Group[]> {
    return this.httpClient.get<Group[]>(this.endPoint + '/groups?userId=' + creatorId);
  }

  getGroup(id: number, creatorId: number): Observable<Group> {
    return this.httpClient.get<Group>(this.endPoint + '/groups/' + id + '?userId=' + creatorId);
  }

  createGroup(name: string, creatorId: number): Observable<Group> {
    return this.httpClient.post<Group>(this.endPoint + '/groups', {name, creatorId, countOfUsers: 1});
  }

  joinGroup(userId: number, groupId: number) {
    return this.httpClient.post(this.endPoint + '/groups/join', {userId, groupId});
  }

  leaveGroup(userId: number, groupId: number) {
    return this.httpClient.post(this.endPoint + '/groups/leave', {userId, groupId});
  }

  updateGroup(id: number, name: string, creatorId: number, countOfUsers: number): Observable<Group> {
    return this.httpClient.put<Group>(this.endPoint + '/groups/' + id, {groupId: id, name, creatorId, countOfUsers});
  }

  deleteGroup(id: number): Observable<string> {
    return this.httpClient.delete<string>(this.endPoint + '/groups/' + id);
  }
}
