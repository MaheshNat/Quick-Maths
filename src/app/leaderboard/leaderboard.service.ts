import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { QuestionService } from '../question.service';
import { map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService implements OnInit, OnDestroy {
  username: string;
  userSub: Subscription;

  arithmeticLeaderboardRef: AngularFireList<{name: string, score: number}> = null;
  powersLeaderboardRef: AngularFireList<{name: string, score: number}> = null;
  numberSenseLeaderboardRef: AngularFireList<{name: string, score: number}> = null;

  constructor(private db: AngularFireDatabase, private authService: AuthService, private questionService: QuestionService) {
    this.arithmeticLeaderboardRef = this.db.list('/arithmetic');
    this.powersLeaderboardRef = this.db.list('/powers');
    this.numberSenseLeaderboardRef = this.db.list('/number-sense');
    this.getUser();
  }

  getUser() {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.username = user.displayName;
      }
    );
  }

  ngOnInit() {
  }

  submitScore(score: number, type: string) {
    switch(type) {
      case 'arithmetic':
        this.arithmeticLeaderboardRef.push({name: this.username, score: score});
        break;
      case 'powers':
        this.powersLeaderboardRef.push({name: this.username, score: score});
        break;
      case 'number-sense':
        this.numberSenseLeaderboardRef.push({name: this.username, score: score});
        break;
    }
  }

  getScores(type: string) {
      switch(type) {
        case 'arithmetic':
          return this.arithmeticLeaderboardRef;
        case 'powers':
          return this.powersLeaderboardRef;
        case 'number-sense':
          return this.numberSenseLeaderboardRef;
      }
  }

  updateScore(type: string, key: string, value: any): Promise<void> {
    switch(type) {
      case 'arithmetic':
        return this.arithmeticLeaderboardRef.update(key, value);
      case 'powers':
        return this.powersLeaderboardRef.update(key, value);;
      case 'number-sense':
        return this.numberSenseLeaderboardRef.update(key, value);;
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
