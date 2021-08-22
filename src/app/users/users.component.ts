import { Component, OnInit } from '@angular/core';
import {User} from '../models/User';
import {UserService} from '../services/userService';
import {GroupService} from '../services/groupService';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {InviteUsersComponent} from './invite-users/invite-users.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  creatorId: number;

  constructor(private userService: UserService,
              private groupService: GroupService,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.creatorId = parseInt(sessionStorage.getItem('userId'));

    this.fetchUsers();
  }

  private fetchUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users.filter(user => user.userId != this.creatorId);
    });
  }

  onClick(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {id};

    const dialogRef = this.dialog.open(InviteUsersComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(note => {

    });
  }

  search(event: any) {
    const searchStr = event.target.value;
    if (searchStr == '') {
      this.fetchUsers();
    }
    else {
      this.userService.getUsers().subscribe((users) => {
        this.users = users.filter(u => u.username.toLowerCase().indexOf(searchStr.toLowerCase()) != -1)
          .filter(user => user.userId != this.creatorId);

      });
    }
  }

  selectSort(value: string) {
    switch (value) {
      case "sortName":
        this.users.sort((first, second) =>
          0 - (first.username < second.username ? -1 : 1));
        break;
      case "dsortName":
        this.users.sort((first, second) =>
          0 - (first.username < second.username ? 1 : -1));
        break;
      default:
        break;
    }
  }

}
