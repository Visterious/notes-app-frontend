import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NoteService} from '../../services/noteService';
import {first} from 'rxjs/operators';
import {Note} from '../../models/Note';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.scss']
})
export class UpdateNoteComponent implements OnInit {
// @ts-ignore
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  groupId: number;
  id: number;
  note: Note;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialogRef: MatDialogRef<UpdateNoteComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private noteService: NoteService) {
  }

  ngOnInit() {
    this.groupId = this.data.groupId;
    this.id = this.data.id;

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      text: ['', Validators.required]
    });
    this.noteService.getNote(this.groupId, this.id).subscribe(note => {
      this.note = note;
      this.f.name.setValue(this.note.name);
      this.f.text.setValue(this.note.text);
    });
  }

  get f() { return this.updateForm.controls; }

  submit() {
    this.submitted = true;
    this.error = '';

    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    this.noteService.updateNote(this.note.userId, this.f.name.value,
                                this.f.text.value, this.note.createdOn, this.groupId, this.id)
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

  onDelete() {
    this.noteService.deleteNote(this.groupId, this.id).subscribe(note => {
      this.dialogRef.close("deleted");
    })
  }

  close() {
    this.dialogRef.close();
  }
}
