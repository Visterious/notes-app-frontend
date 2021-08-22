import { Component, OnInit } from '@angular/core';
import {Group} from '../models/Group';
import {GroupService} from '../services/groupService';
import {UserService} from '../services/userService';
import {User} from '../models/User';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {CreateGroupComponent} from './create-group/create-group.component';
import {UpdateGroupComponent} from './update-group/update-group.component';
import {Invite} from '../models/Invite';
import {InviteService} from '../services/inviteService';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  groups: Group[] = [];
  invites: Invite[] = [];

  userId: number;

  constructor(private groupService: GroupService,
              private userService: UserService,
              private inviteService: InviteService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userId = parseInt(sessionStorage.getItem('userId'));

    this.fetchGroups();
    this.fetchInvites();
  }

  private fetchGroups() {
    this.groupService.getGroups(parseInt(sessionStorage.getItem('userId'))).subscribe((groups) => {
      this.groups = groups;
      this.groups.forEach(group => this.getUsername(group.creatorId).then((data:User) => group.creatorName = data.username));
      this.selectSort("sortName");
    });
  }

  private fetchInvites() {
    this.inviteService.getInvites(this.userId).subscribe(invites => {
      this.invites = invites;
      this.invites.forEach(invite => this.getUsername(invite.inviterId).then((data:User) => invite.username = data.username));
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

  onUpdate(id: number, creatorId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {id, creatorId};

    const dialogRef = this.dialog.open(UpdateGroupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(group => {
      if (group == null) return;

      let updateItem = this.groups.find(obj => obj.groupId == id);
      let index = this.groups.indexOf(updateItem);
      this.getUsername(group.creatorId).then((data:User) => group.creatorName = data.username)
      this.groups[index] = group;
    });
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(CreateGroupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(group => {
      this.getUsername(group.creatorId).then((data:User) => group.creatorName = data.username)
      this.groups.push(group);
    });
  }

  join(id: number, groupId: number) {
    this.groupService.joinGroup(this.userId, groupId).subscribe(invite => {
      this.reject(id);
      this.fetchGroups();
    });
  }

  reject(id: number) {
    this.inviteService.deleteInvite(id).subscribe(invite => {
      let updateItem = this.invites.find(obj => obj.inviteId == id);
      let index = this.invites.indexOf(updateItem);
      this.invites.splice(index, 1);
    })
  }

  search(event: any) {
    const searchStr = event.target.value;
    if (searchStr == '') {
      this.fetchGroups();
    }
    else {
      this.groupService.getGroups(this.userId).subscribe((groups) => {
        this.groups = groups.filter(g => g.name.toLowerCase().indexOf(searchStr.toLowerCase()) != -1);
        this.groups.forEach(group => this.getUsername(group.creatorId).then((data:User) => group.creatorName = data.username));
      });
    }
  }

  selectSort(value: string) {
    switch (value) {
      case "sortName":
        this.groups.sort((first, second) =>
          0 - (first.name < second.name ? -1 : 1));
        break;
      case "dsortName":
        this.groups.sort((first, second) =>
          0 - (first.name < second.name ? 1 : -1));
        break;
      default:
        break;
    }
  }
}
