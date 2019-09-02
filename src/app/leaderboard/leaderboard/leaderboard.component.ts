import { Component, OnInit } from '@angular/core';
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
  scores: {name: string, score: number, key: string}[];

  constructor(private route: ActivatedRoute, private ldbService: LeaderboardService, private authService: AuthService) { }

  ngOnInit() {
    this.test = this.route.snapshot.params['test'];
    this.route.params.subscribe(
      params => {
        this.test = params['test'];
        this.getScores();
      }
    );
  }

  getScores() {
    this.ldbService.getScores(this.test).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(scores => {
      for(let score of scores)
        console.log(score);
      this.scores = scores;
      this.scores.sort(
        (a, b) => {
          return a.score < b.score ? 1 : -1
        }
      )
      if(this.scores.length > 100)
        this.scores = this.scores.slice(100, this.scores.length);
    });
  }

}
