import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaderboardService } from '../leaderboard.service';
import { map } from 'rxjs/operators';
import { AngularFireList } from '@angular/fire/database';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  test: string;
  public leaderboard: { name: string; score: number; key: string }[];

  constructor(
    private route: ActivatedRoute,
    private ldbService: LeaderboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.test = this.route.snapshot.params['test'];
    this.route.params.subscribe(params => {
      this.test = params['test'];
      this.getScores();
    });
  }

  getScores() {
    this.ldbService
      .getScores(this.test)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe(leaderboard => {
        console.log(this.test + ' leaderboard:');
        for (let score of leaderboard)
          console.log('name: ' + score.name + ', score: ' + score.score);
        this.leaderboard = leaderboard;
        this.sortScores();
      });
  }

  sortScores() {
    this.leaderboard.sort((a, b) => {
      return a.score < b.score ? 1 : -1;
    });
    if (this.leaderboard.length > 100)
      this.leaderboard = this.leaderboard.slice(100, this.leaderboard.length);
  }
}
