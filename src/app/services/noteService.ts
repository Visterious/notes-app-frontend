import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/Note';
import * as config from '../config.js';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  endPoint = config.endPoint;

  constructor(private httpClient: HttpClient) {
  }

  getNotes(groupId: number): Observable<Note[]> {
    return this.httpClient.get<Note[]>(this.endPoint + '/notes/' + groupId);
  }

  getNote(groupId: number, id: number): Observable<Note> {
    return this.httpClient.get<Note>(this.endPoint + '/notes/' + groupId + "/" + id);
  }

  createNote(userId: number, name: string, text: string, groupId: number): Observable<Note> {
    let createdOn: string = new Date().toLocaleString();
    return this.httpClient.post<Note>(this.endPoint + '/notes', {userId, name, text, createdOn, groupId});
  }

  updateNote(userId: number, name: string, text: string, createdOn: string, groupId: number, id: number) {
    return this.httpClient.put(this.endPoint + '/notes/' + groupId+ "/" + id, {userId, name, text, createdOn, groupId, noteId: id});
  }

  deleteNote(groupId: number, id: number): Observable<string> {
    return this.httpClient.delete<string>(this.endPoint + '/notes/' + groupId+ "/" + id);
  }
}
