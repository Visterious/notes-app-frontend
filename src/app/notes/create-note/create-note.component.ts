import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'rxjs/operators';
import {NoteService} from '../../services/noteService';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
// @ts-ignore
  createForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  groupId: number;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialogRef: MatDialogRef<CreateNoteComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private noteService: NoteService) {
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      text: ['', Validators.required]
    });

    this.groupId = this.data.groupId;
  }

  get f() { return this.createForm.controls; }

  submit() {
    this.submitted = true;
    this.error = '';

    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    this.noteService.createNote(parseInt(sessionStorage.getItem('userId')), this.f.name.value, this.f.text.value, this.groupId)
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
