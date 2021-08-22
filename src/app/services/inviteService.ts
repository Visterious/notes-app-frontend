import {Injectable} from '@angular/core';
import * as config from '../config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Invite} from '../models/Invite';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  endPoint = config.endPoint;

  constructor(private httpClient: HttpClient) {
  }

  getInvites(creatorId: number): Observable<Invite[]> {
    return this.httpClient.get<Invite[]>(this.endPoint + '/invites?userId=' + creatorId);
  }

  createInvite(inviterId: number, invitedId: number, groupId: number): Observable<Invite> {
    return this.httpClient.post<Invite>(this.endPoint + '/invites', {inviterId, invitedId, groupId});
  }

  deleteInvite(id: number) {
    return this.httpClient.delete(this.endPoint + '/invites/' + id);
  }

}
