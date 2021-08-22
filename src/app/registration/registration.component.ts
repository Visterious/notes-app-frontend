import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/userService';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
// @ts-ignore
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';
  sent = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
    if (this.userService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() { return this.registrationForm.controls; }

  submit() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    if (this.f.password.value && this.f.password2.value && this.f.password.value != this.f.password2.value) {
      this.error = "Passwords aren't equal";
      return;
    }

    this.loading = true;
    this.userService.registration(this.f.username.value,
      this.f.password.value).pipe()
      .subscribe(
        data => {
          this.sent = true;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error += '\n' + error;
          this.loading = false;
          if (error == 'OK') {
            this.router.navigate([this.returnUrl]);
          }
        }
      );
  }
}
