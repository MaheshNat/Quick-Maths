import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnDestroy {
  @ViewChild('answer', {static: true}) answerInput: ElementRef;
  constructor(private route: ActivatedRoute, private questionService: QuestionService) { }

  ngOnInit() {
    
  }

  answerChanged(f: NgForm, event) {
    if(+this.answerInput.nativeElement.value === this.questionService.question.answer) {
      this.questionService.questionAnswered();
      f.reset();
    }
  }

  ngOnDestroy() {
    this.questionService.intervalSubscription.unsubscribe();
    clearTimeout(this.questionService.intervalTimer);
  }
}
