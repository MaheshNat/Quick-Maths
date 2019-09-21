import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['../tests.component.css']
})
export class PowersComponent implements OnInit {
  @ViewChild('f', { static: true }) powersForm: NgForm;

  constructor(
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.powersForm.setValue({
        squares: true,
        squaresMin: '10',
        squaresMax: '40',
        cubes: true,
        cubesMin: '5',
        cubesMax: '20',
        powers: true,
        duration: '120 seconds'
      });
    });
  }

  onSubmit(form: NgForm) {
    this.questionService.onSubmitForm(form, 'powers');
    this.router.navigate(['/test']);
  }
}
