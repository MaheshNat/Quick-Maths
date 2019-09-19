import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionService } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-test-end',
  templateUrl: './test-end.component.html',
  styleUrls: ['./test-end.component.css']
})
export class TestEndComponent implements OnInit, OnDestroy {
  scores: { name: string; score: number; key: string }[];
  test: string;
  userSub: Subscription;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router,
    private ldbService: LeaderboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.user) return;
    this.userSub = this.authService.user.subscribe(user => {
      if (!user) return;
      this.username = user.displayName;
      console.log('reached user is authenticated');
      this.handleScoreSubmission();
    });
  }

  handleScoreSubmission() {
    if (
      +this.questionService.form['duration'].split(' ')[0] !== 120 &&
      (+this.questionService.form['duration'].split(' ')[0] !== 600 ||
        this.questionService.test !== 'number-sense')
    )
      return;
    console.log('reached here form data is valid');
    this.getScores().subscribe(leaderboard => {
      console.log('scores: ' + leaderboard);
      this.scores = leaderboard;
      for (let score of this.scores) console.log(score);

      if (!this.scores) {
        console.log('leaderboard is empty');
        this.ldbService.submitScore(
          this.questionService.score,
          this.questionService.test
        );
        return;
      }
      let nameFound = false;
      for (let score of this.scores) {
        if (score.name === this.username) {
          nameFound = true;
          if (this.questionService.score > score.score) {
            console.log('better score');
            this.ldbService
              .updateScore(this.questionService.test, score.key, {
                score: this.questionService.score
              })
              .catch(err => {
                console.log(' error updating score: ' + err);
              });
            return;
          }
        }
      }
      if (!nameFound) {
        console.log('first time taking test');
        this.ldbService.submitScore(
          this.questionService.score,
          this.questionService.test
        );
      }
    });
  }

  getScores() {
    return this.ldbService
      .getScores(this.questionService.test)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
  }

  sortScores() {
    this.scores.sort((a, b) => {
      return a.score < b.score ? 1 : -1;
    });
    if (this.scores.length > 100)
      this.scores = this.scores.slice(100, this.scores.length);
  }

  onTryAgain() {
    this.questionService.startTest();
    this.router.navigate(['/test']);
  }

  onChangeSettings() {
    this.questionService.reset();
    switch (this.questionService.test) {
      case 'arithmetic':
        this.router.navigate(['/arithmetic']);
        break;
      case 'powers':
        this.router.navigate(['/powers']);
        break;
      case 'number-sense':
        this.router.navigate(['/number-sense']);
        break;
    }
  }

  ngOnDestroy() {
    this.questionService.score = 0;
    this.questionService.questionsCorrectlyAnswered = 0;
    this.questionService.questionsMissed = 0;
    this.userSub.unsubscribe();
  }
}
