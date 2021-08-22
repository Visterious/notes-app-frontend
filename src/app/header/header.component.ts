import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/userService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLog = false;

  constructor(private userService: UserService,
              private router: Router) {
    if (sessionStorage.getItem('currentUser')) {
      this.isLog = true;
    }
  }

  ngOnInit(): void {
  }

  logout() {
    this.isLog = false;
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
