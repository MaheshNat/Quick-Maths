import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionService } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
;

@Component({
  selector: 'app-test-end',
  templateUrl: './test-end.component.html',
  styleUrls: ['./test-end.component.css']
})
export class TestEndComponent implements OnInit, OnDestroy {
  scores: {name: string, score: number, key: string}[];
  test: string;
  userSub: Subscription;
  leaderboardSub: Subscription;
  username: string;

  constructor(private route: ActivatedRoute, private questionService: QuestionService, private router: Router, private ldbService: LeaderboardService, private authService: AuthService) { }

  ngOnInit() {
    if(!this.authService.user)
      return;
    this.authService.user.subscribe(
      user => {
        if(!user)
          return;
        this.username = user.displayName;
        this.handleScoreSubmission();
      }
    );
  }

  handleScoreSubmission() {
    if(+this.questionService.form['duration'].split(' ')[0] !== 120)
      return;
    this.leaderboardSub = this.getScores().subscribe(
      leaderboard => {
        console.log('scores: ' + leaderboard);
        this.scores = leaderboard;
        for(let score of this.scores)
          console.log(score);

        if(!this.scores) {
          console.log('leaderboard is empty');
          this.ldbService.submitScore(this.questionService.score, this.questionService.type);
          return;
        }
        let nameFound = false;
        for(let score of this.scores) {
          if(score.name === this.username) {
            nameFound = true;
            if(this.questionService.score > score.score) {
              console.log('better score');
              this.ldbService.updateScore(this.questionService.type, score.key, { score: this.questionService.score}).catch(err => { console.log(' error updating score: ' + err)});
              return;
            }
          }
        }
        if(!nameFound) {
          console.log('first time taking test');
          this.ldbService.submitScore(this.questionService.score, this.questionService.type);
        }
      }
    );
  }

  getScores() {
    return this.ldbService.getScores(this.questionService.type).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    )
  }

  sortScores() {
    this.scores.sort(
      (a, b) => {
        return a.score < b.score ? 1 : -1
      }
    )
    if(this.scores.length > 100)
      this.scores = this.scores.slice(100, this.scores.length);
  }

  onTryAgain() {
    this.questionService.score = 0;
    this.questionService.questionsCorrectlyAnswered = 0;
    this.questionService.questionsMissed = 0;
    this.questionService.question = this.questionService.generateQuestion();
    let duration = +(this.questionService.form.duration.split(' ')[0]);
    this.questionService.secondsLeft = duration;
    this.questionService.intervalSubscription = interval(1000).subscribe(
        () => {
            this. questionService.secondsLeft--;
        }
    );
    this.questionService.intervalTimer = setTimeout(() => {
      this.router.navigate(['/test-end']);
    }, duration * 1000);
    this.router.navigate(['/test']);
  }

  onChangeSettings() {
    this.questionService.score = 0;
    this.questionService.questionsCorrectlyAnswered = 0;
    this.questionService.questionsMissed = 0;
    switch(this.questionService.type) {
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
    this.leaderboardSub.unsubscribe();
  }
}
