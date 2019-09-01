import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-test-end',
  templateUrl: './test-end.component.html',
  styleUrls: ['./test-end.component.css']
})
export class TestEndComponent implements OnInit {


  constructor(private questionService: QuestionService, private router: Router) { }

  ngOnInit() {
  }

  onTryAgain() {
    this.questionService.score = 0;
    this.questionService.question = this.questionService.generateQuestion();
    let duration = +(this.questionService.form.duration.split(' ')[0]);
    this.questionService.secondsLeft = duration;
    this.questionService.intervalSubscription = interval(1000).subscribe(
        () => {
            this.questionService.secondsLeft--;
        }
    );
    this.questionService.intervalTimer = setTimeout(() => {
      this.router.navigate(['/test-end']);
    }, duration * 1000);
    this.router.navigate(['/test']);
  }

  onChangeSettings() {
    this.questionService.score = 0;
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
}
