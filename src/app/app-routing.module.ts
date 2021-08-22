import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {GroupsComponent} from './groups/groups.component';
import {AuthGuard} from './models/auth.guard';
import {NotesComponent} from './notes/notes.component';
import {UsersComponent} from './users/users.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'groups', canActivate: [AuthGuard], children: [
      {path: '', component: GroupsComponent},
      {path: ':groupId/:creatorId', component: NotesComponent}
    ]},
  {path: 'users', canActivate: [AuthGuard], component: UsersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
