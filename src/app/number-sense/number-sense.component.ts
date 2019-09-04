import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-number-sense',
  templateUrl: './number-sense.component.html',
  styleUrls: ['./number-sense.component.css']
})
export class NumberSenseComponent implements OnInit {

  @ViewChild('f', {static: true}) numberSenseForm: NgForm;

  constructor(private router: Router, private questionService: QuestionService) { }

  ngOnInit() {
    setTimeout(() => {
      this.numberSenseForm.setValue({
        section1: true,
        section2: true,
        section3: true,
        section4: true,
        section5: true,
        duration: '600 seconds'
      });
    }, );
  }

  onSubmit(form: NgForm) {
    this.questionService.onSubmitForm(form, 'number-sense');
    this.router.navigate(['/test']);
  }

}
