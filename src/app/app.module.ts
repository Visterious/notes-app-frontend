import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GroupsComponent } from './groups/groups.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './models/jwt.interceptor';
import {ErrorInterceptor} from './models/error.interceptor';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotesComponent } from './notes/notes.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateGroupComponent } from './groups/create-group/create-group.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreateNoteComponent } from './notes/create-note/create-note.component';
import { UpdateNoteComponent } from './notes/update-note/update-note.component';
import { UpdateGroupComponent } from './groups/update-group/update-group.component';
import { UsersComponent } from './users/users.component';
import { InviteUsersComponent } from './users/invite-users/invite-users.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GroupsComponent,
    LoginComponent,
    RegistrationComponent,
    NotesComponent,
    HomeComponent,
    PageNotFoundComponent,
    CreateGroupComponent,
    CreateNoteComponent,
    UpdateNoteComponent,
    UpdateGroupComponent,
    UsersComponent,
    InviteUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    NoopAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateGroupComponent
  ]
})
export class AppModule { }
