import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {GroupService} from '../../services/groupService';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
// @ts-ignore
  createForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialogRef: MatDialogRef<CreateGroupComponent>,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  get f() { return this.createForm.controls; }

  submit() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    this.groupService.createGroup(this.f.name.value, parseInt(sessionStorage.getItem('userId')))
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
