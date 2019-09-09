import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-arithmetic',
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.css']
})
export class ArithmeticComponent implements OnInit {
  @ViewChild('f', { static: true }) arithmeticForm: NgForm;

  constructor(
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.arithmeticForm.setValue({
        addition: true,
        addition1Min: '12',
        addition1Max: '100',
        addition2Min: '12',
        addition2Max: '100',
        division: true,
        multiplication: true,
        multiplication1Min: '2',
        multiplication1Max: '12',
        multiplication2Min: '2',
        multiplication2Max: '100',
        subtraction: true,
        duration: '120 seconds'
      });
    });
  }

  onSubmit(form: NgForm) {
    this.questionService.onSubmitForm(form, 'arithmetic');
    this.router.navigate(['/test']);
  }
}
