import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  testDropdown = false;
  accountDropdown = false;
  leaderboardDropdown = false;
  isAuthenticated = false;
  user: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe(
      user => {
        this.isAuthenticated = !!user;
        this.user = user;
      }
    );  
  }
}
