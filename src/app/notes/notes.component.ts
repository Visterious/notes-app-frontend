import { Component, OnInit } from '@angular/core';
import {NoteService} from '../services/noteService';
import {User} from '../models/User';
import {Note} from '../models/Note';
import {UserService} from '../services/userService';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreateNoteComponent} from './create-note/create-note.component';
import {UpdateNoteComponent} from './update-note/update-note.component';
import {GroupService} from '../services/groupService';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];
  groupId: number;
  creatorId: number;
  userId: number;

  constructor(private noteService: NoteService,
              private userService: UserService,
              private groupService: GroupService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.groupId = parseInt(this.route.snapshot.paramMap.get("groupId"));
    this.creatorId = parseInt(this.route.snapshot.paramMap.get("creatorId"));
    this.userId = parseInt(sessionStorage.getItem('userId'));

    this.fetchNotes(this.groupId);
  }

  private fetchNotes(groupId: number) {
    this.noteService.getNotes(groupId).subscribe((notes) => {
      this.notes = notes;
      this.notes.forEach(note => this.getUsername(note.userId).then((data:User) => note.username = data.username));
      this.selectSort("sortDate");
    });
  }

  getUsername(id: number) {
    return new Promise(resolve=>{
      this.userService.getUser(id)
        .subscribe(
          (data:User) => {
            resolve(data);
          })
    })
  }

  onUpdate(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {groupId: this.groupId, id};

    const dialogRef = this.dialog.open(UpdateNoteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(note => {
      if (note == null) return;
      let updateItem = this.notes.find(obj => obj.noteId == id);
      let index = this.notes.indexOf(updateItem);
      if (note == "deleted") {
        this.notes.splice(index, 1);
      } else {
        this.getUsername(note.userId).then((data: User) => note.username = data.username);
        this.notes[index] = note;
      }
    });
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {groupId: this.groupId};

    const dialogRef = this.dialog.open(CreateNoteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(note => {
      if (note != null) {
        this.getUsername(note.userId).then((data: User) => note.username = data.username);
        this.notes.push(note);
      }
    });
  }

  onDelete() {
    if (this.userId == this.creatorId) {
      this.groupService.deleteGroup(this.groupId).subscribe(data => {
        this.router.navigate(['/groups']);
      })
    } else {
      this.groupService.leaveGroup(this.userId, this.groupId).subscribe(data => {
        this.router.navigate(['/groups']);
      })
    }
  }

  search(event: any) {
    const searchStr = event.target.value;
    if (searchStr == '') {
      this.fetchNotes(this.groupId);
    }
    else {
      this.noteService.getNotes(this.groupId).subscribe((notes) => {
        this.notes = notes.filter(n => n.name.toLowerCase().indexOf(searchStr.toLowerCase()) != -1)
      });
    }
  }

  selectSort(value: string) {
    switch (value) {
      case "sortName":
        this.notes.sort((first, second) =>
          0 - (first.name < second.name ? -1 : 1));
        break;
      case "dsortName":
        this.notes.sort((first, second) =>
          0 - (first.name < second.name ? 1 : -1));
        break;
      case "sortDate":
        this.notes.sort((first, second) =>
          0 - (new Date(first.createdOn).getTime() < new Date(second.createdOn).getTime() ? -1 : 1));
        break;
      case "dsortDate":
        this.notes.sort((first, second) =>
          0 - (new Date(first.createdOn).getTime() < new Date(second.createdOn).getTime() ? 1 : -1));
        break;
      default:
        break;
    }
  }
}
