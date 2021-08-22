import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupService} from '../../services/groupService';
import {Group} from '../../models/Group';
import {UserService} from '../../services/userService';
import {InviteService} from '../../services/inviteService';
import {Invite} from '../../models/Invite';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.scss']
})
export class InviteUsersComponent implements OnInit {

  groups: Group[] = [];
  invites: Invite[] = [];

  toggle = true;

  invitedId: number;
  inviterId: number;

  constructor(private router: Router,
              private dialogRef: MatDialogRef<InviteUsersComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private groupService: GroupService,
              private inviteService: InviteService) { }

  ngOnInit(): void {
    this.invitedId = this.data.id;
    this.inviterId = parseInt(sessionStorage.getItem('userId'));

    this.inviteService.getInvites(this.invitedId).subscribe(invites => {
      this.invites = invites;
    });

    this.fetchGroups();
  }

  fetchGroups() {
    this.groupService.getGroups(this.inviterId).subscribe(groups => {
      this.groups = groups.filter(group => {
        for (let i = 0; i < group.users.length; i++) {
          if (group.users[i].userId == this.invitedId) {
            return false;
          }
        }
        return true;
      });
      this.groups.forEach(group => {
        for (let i = 0; i < this.invites.length; i++) {
          if (this.invites[i].groupId == group.groupId && this.invites[i].invitedId == this.invitedId) {
            group.invited = true;
            return;
          } else {
            group.invited = false;
          }
        }
      })
      this.toggle = (this.groups.length == 0);
    }, error => {
      this.toggle = true;
    })
  }

  onClick(groupId: number) {
    this.inviteService.createInvite(this.inviterId, this.invitedId, groupId).subscribe(invite => {
      this.dialogRef.close();
    })
  }

  close() {
    this.dialogRef.close();
  }

}
