import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  arithmeticLeaderboardRef: AngularFireList<{name: string, score: number}> = null;
  powersLeaderboardRef: AngularFireList<{name: string, score: number}> = null;
  numberSenseLeaderboardRef: AngularFireList<{name: string, score: number}> = null;

  constructor(private db: AngularFireDatabase, private authService: AuthService) {
    this.arithmeticLeaderboardRef = db.list('/arithmetic');
    this.powersLeaderboardRef = db.list('/powers');
    this.numberSenseLeaderboardRef = db.list('/number-sense');
  }

  submitScore(score: number, type: string) {
    let username: string;
    this.authService.user.subscribe(
      user => {
        username = user.displayName;
      }
    );
    switch(type) {
      case 'arithmetic':
        this.arithmeticLeaderboardRef.push({name: username, score: score});
        break;
      case 'powers':
        this.powersLeaderboardRef.push({name: username, score: score});
        break;
      case 'number-sense':
        this.numberSenseLeaderboardRef.push({name: username, score: score});
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
}
