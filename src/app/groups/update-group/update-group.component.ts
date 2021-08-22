import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupService} from '../../services/groupService';
import {first} from 'rxjs/operators';
import {Group} from '../../models/Group';

@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.scss']
})
export class UpdateGroupComponent implements OnInit {
// @ts-ignore
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  id: number;
  creatorId: number;
  group: Group;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialogRef: MatDialogRef<UpdateGroupComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.id = this.data.id;
    this.creatorId = this.data.creatorId;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.groupService.getGroup(this.id, this.creatorId).subscribe(group => {
      this.group = group;
      this.f.name.setValue(this.group.name);
    });
  }

  get f() { return this.updateForm.controls; }

  submit() {
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    this.groupService.updateGroup(this.id, this.f.name.value, this.creatorId, this.group.countOfUsers)
      .pipe(first())
      .subscribe(
        data => {
          this.dialogRef.close(data);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  close() {
    this.dialogRef.close();
  }
}
