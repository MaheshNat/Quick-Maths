import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject, Subscription, interval, BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class QuestionService implements OnInit, OnDestroy {
    form: any;
    type: string;
    choices: string[] = [];
    secondsLeft: number;
    score = 0;
    question: {question: string, answer: number};
    intervalSubscription: Subscription;
    intervalTimer;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {}

    onSubmitForm(form: NgForm, type: string) {
        this.form = form.value;
        this.type = type;
        if(this.type === 'arithmetic') {
            if(this.form.addition === true)
                this.choices.push('addition');
            if(this.form.subtraction === true)
                this.choices.push('subtraction');
            if(this.form.multiplication === true)
                this.choices.push('multiplication');
            if(this.form.division === true)
                this.choices.push('division');
        }  else if(this.type === 'powers') {
            if(this.form.squares === true)
                this.choices.push('squares');
            if(this.form.cubes === true)
                this.choices.push('cubes');
            if(this.form.powers === true)
                this.choices.push('powers');
        }  
        this.question = this.generateQuestion();
        let duration = +(this.form.duration.split(' ')[0]);
        this.secondsLeft = duration;
        this.intervalSubscription = interval(1000).subscribe(
            () => {
                this.secondsLeft--;
            }
        );
        this.intervalTimer = setTimeout(() => {
            this.router.navigate(['/test-end']);
        }, duration * 1000);
        console.log(this.form);
    }

    randomInteger(min: number, max: number) {
        let range = max - min + 1;
        return Math.floor(Math.random() * range + min);
    }

    generateQuestion(): {question: string, answer: number} {
        switch(this.type) {
            case 'arithmetic':
                return this.generateArithmeticQuestion();
            case 'powers':
                return this.generatePowersQuestion();
            case 'number-sense':
                return this.generateNumberSenseQuestion();
        }
    }

    generateArithmeticQuestion(): {question: string, answer: number} {
        let choice = this.choices[this.randomInteger(0, this.choices.length - 1)];
        switch(choice) {
            case 'addition':
                return this.generateAdditionQuestion();
            case 'subtraction':
                return this.generateSubtractionQuestion();
            case 'multiplication':
                return this.generateMultiplicationQuestion();
            case 'division':
                return this.generateDivisionQuestion();
        }
    }

    generateAdditionQuestion() {
        let num1 = this.randomInteger(this.form.addition1Min, this.form.addition1Max);
        let num2 = this.randomInteger(this.form.addition2Min, this.form.addition2Max);
        return {question: num1 + ' + ' + num2 + ' =', answer: (num1 + num2)};
    }

    generateSubtractionQuestion() {
        let num1 = this.randomInteger(this.form.addition1Min, this.form.addition1Max);
        let num2 = this.randomInteger(this.form.addition2Min, this.form.addition2Max);
        return {question: (num1 + num2) + ' - ' + num2 + ' =', answer: num1};
    }

    generateMultiplicationQuestion() {
        let num1 = this.randomInteger(this.form.multiplication1Min, this.form.multiplication1Max);
        let num2 = this.randomInteger(this.form.multiplication2Min, this.form.multiplication2Max);
        return {question: num1 + ' x ' + num2 + ' =', answer: (num1 * num2)};
    }

    generateDivisionQuestion() {
        let num1 = this.randomInteger(this.form.multiplication1Min, this.form.multiplication1Max);
        let num2 = this.randomInteger(this.form.multiplication2Min, this.form.multiplication2Max);
        return {question: (num1 * num2) + ' / ' + num2 + ' =', answer: num1};
    }

    generatePowersQuestion(): {question: string, answer: number} {
        let choice = this.choices[this.randomInteger(0, this.choices.length - 1)];
        switch(choice) {
            case 'squares':
                return this.generateSquaresQuestion();
            case 'cubes':
                return this.generateCubesQuestion();
            case 'powers':
                return this.generatePowersQuestion_();
        }
    }

    generateSquaresQuestion() {
        let num = this.randomInteger(this.form.squaresMin, this.form.squaresMax);
        return {question: num + '^2 =', answer: Math.pow(num, 2)};
    }

    generateCubesQuestion() {
        let num = this.randomInteger(this.form.cubesMin, this.form.cubesMax);
        return {question: num + '^3 =', answer: Math.pow(num, 3)};
    }

    generatePowersQuestion_() {
        // powers of 3 from 3 to 8, powers of 4 from 3 to 6, powers of 5 from 3 to 5, and powers of 6, 7, 8, and 9 from 3 to 4
        const num = this.randomInteger(3, 9);
        switch(num) {
            case 3:
                let exp1 = this.randomInteger(3, 8);
                return {question: num + '^' + exp1 + '= ', answer: Math.pow(num, exp1)};
            case 4:
                let exp2 = this.randomInteger(3, 6);
                return {question: num + '^' + exp2 + '= ', answer: Math.pow(num, exp2)};
            case 5:
                let exp3 = this.randomInteger(3, 5);
                return {question: num + '^' + exp3 + '= ', answer: Math.pow(num, exp3)};
            case 6:
            case 7:
            case 8:
            case 9:
                let exp4 = this.randomInteger(3, 4);
                return {question: num + '^' + exp4 + '= ', answer: Math.pow(num, exp4)};
        } 
    }

    generateNumberSenseQuestion() {
        return {question: '', answer: 0};
    }

    questionAnswered() {
        this.score += 1;
        this.question = this.generateQuestion();
    }

    ngOnDestroy() {
        this.intervalSubscription.unsubscribe();
        clearTimeout(this.intervalTimer);
        this.choices = [];
        this.score = 0;
    }
}