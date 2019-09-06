import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject, Subscription, interval, BehaviorSubject } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

@Injectable({providedIn: 'root'})
export class QuestionService implements OnInit, OnDestroy {
    form: any;
    type: string;
    choices: string[] = [];
    secondsLeft: number;
    score = 0;
    questionsCorrectlyAnswered = 0;
    questionsMissed = 0;
    question: {question: string, answer: any};
    intervalSubscription: Subscription;
    intervalTimer;
    section1 = ['multiplicationTrick', 'fraction', 'remainder', 'conversion'];

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {}

    onSubmitForm(form: NgForm, type: string) {
        this.form = form.value;
        this.type = type;
        if(this.type === 'arithmetic') {
            if(this.form.addition)
                this.choices.push('addition');
            if(this.form.subtraction)
                this.choices.push('subtraction');
            if(this.form.multiplication)
                this.choices.push('multiplication');
            if(this.form.division)
                this.choices.push('division');
        }  else if(this.type === 'powers') {
            if(this.form.squares)
                this.choices.push('squares');
            if(this.form.cubes)
                this.choices.push('cubes');
            if(this.form.powers)
                this.choices.push('powers');
        }  else {
            console.log('reached here');
            if(this.form.section1)
                this.choices.push('section1');
            if(this.form.section2)
                this.choices.push('section2');
            if(this.form.section3)
                this.choices.push('section3');
            if(this.form.section4)
                this.choices.push('section4');
            if(this.form.section5)
                this.choices.push('section5');
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

    generateQuestion(): {question: string, answer: any} {
        switch(this.type) {
            case 'arithmetic':
                return this.generateArithmeticQuestion();
            case 'powers':
                return this.generatePowersQuestion();
            case 'number-sense':
                console.log('number-sense generateQuestion() called');
                return this.generateNumberSenseQuestion();
        }
    }

    generateArithmeticQuestion(): {question: string, answer: any} {
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

    generatePowersQuestion(): {question: string, answer: any} {
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

    generateNumberSenseQuestion(): {question: string, answer: any} {
        // let choice = this.choices[this.randomInteger(0, this.choices.length)];
        // switch(choice) {
        //     case 'section1':
        //         return this.generateSection1Question();
        //     case 'section2':
        //         return this.generateSection2Question();
        //     case 'section3':
        //         return this.generateSection3Question();
        //     case 'section4':
        //         return this.generateSection4Question();
        //     case 'section5':
        //         return this.generateSection5Question();
        // }
        return this.generateSection1Question();
    }

    generateSection1Question() {
        let choice = this.section1[this.randomInteger(0, this.section1.length)];
        switch(choice) {
            case 'multiplicationTrick':
                return this.generateMultiplicationTrickQuestion();
            case 'fraction':
                return this.generateFractionQuestion();
            case 'remainder':
                return this.generateRemainderQuestion();
            case 'conversion':
                return this.generateConversionQuestion();
        }
    }

    generateMultiplicationTrickQuestion() {
        let choice = this.randomInteger(0, 11);
        let num = this.randomInteger(20, 1000);
        switch(choice) {
            case 0:
                return { question: `${num} * 11`, answer: num * 11};
            case 1:
                return { question: `${num} * 101`, answer: num * 101};
            case 2:
                return { question: `${num} * 25`, answer: num * 25};
            case 3:
                return { question: `${num} * 75`, answer: num * 75};
            case 4:
                let num1 = this.randomInteger(20, 99);
                let num2 = this.randomInteger(20, 99);
                return { question: `${num1} * ${num2}`, answer: num1 * num2};
            case 5:
                return this.generateNear100Question();
            case 6:
                let num3 = this.randomInteger(3, 12);
                return {question: `${num3 * 10 + 5} ^ 2`, answer: (num3 * 10 + 5)^2};
            case 7:
                let num4 = this.randomInteger(0, 10);
                let num5 = this.randomInteger(20, 50);
                return {question: `${num5 - num4} * ${num5 + num4}`, answer: (num5 - num4) * (num5 + num4)};
            case 8:
                let num6 = this.randomInteger(11, 80);
                let reverse = parseInt('' + stringify(num6)[1] + parseInt(stringify(num6)[0]));
                return {question: `${num6} * ${reverse}`, answer: num6 * reverse};
            case 9:
                let num7 = this.randomInteger(11, 80);
                return {question: `${num7}^2 + ${num7 + 1}^2`, answer: num7^2 + (num7 + 1)^2};
            case 10:
                let num8 = this.randomInteger(100, 1000);
                let num9 = this.randomInteger(100, 1000);
                let num10 = this.randomInteger(100, 1000);
                return {question: `${num8} + ${num9} + ${num10}`, answer: num8 + num9 + num10};
        }
    }

    generateNear100Question() {
        let choice = this.randomInteger(0, 3);
        let num1 = this.randomInteger(1, 13);
        let num2 = this.randomInteger(1, 13);
        switch(choice) {
            case 0:
                return {question: `${100 - num1} * ${100 - num2}`, answer: (100 - num1) * (100 - num2)};
            case 1:
                return {question: `${100 + num1} * ${100 + num2}`, answer: (100 + num1) * (100 + num2)};
            case 2:
                return {question: `${100 + num1} * ${100 - num2}`, answer: (100 + num1) * (100 - num2)};
        }
    }

    generateFractionQuestion() {
        let choice = this.randomInteger(0, 2);
        switch(choice) {
            case 0:
                let a = this.randomInteger(17, 40);
                let b = a + this.randomInteger(2, 5);
                return {question: `${a} * ${a}/${b}`, answer: `${a + (a - b)} ${(a - b)^2}/${b}`};
            case 1:
                let a1 = this.randomInteger(3, 20);
                let b1 = this.randomInteger(3, 20);
                return {question: `${a1}/${b1} + ${b1}/${a1}`, answer: `2 ${(a1 - b1)^2}/${a1*b1}`};
        }
    }

    generateRemainderQuestion() {
        let remainderNums = [3, 4, 8, 9, 11];
        let num1 = remainderNums[this.randomInteger(0, remainderNums.length)];
        let num2 = this.randomInteger(300, 100000);
        return {question: `${num2} % ${num1}`, answer: num2 % num1};
    }

    generateConversionQuestion() {
        let choice = this.randomInteger(0, 3);
        switch(choice) {
            case 0:
               return this.generateRomanNumeralQuestion();
            case 1:
                return this.generateUnitConversionQuestion();
                
        }
    }

    generateRomanNumeralQuestion() {
        let choice = this.randomInteger(0, 3);
        let num = this.randomInteger(100, 999);
        let num1 = this.randomInteger(100, 999);
        switch(choice) {
            case 0:
                return {question: `convert ${num} to a roman numeral`, answer: this.toRoman(num)};
            case 1:
                return {question: `convert ${this.toRoman(num)} to an arabic numeral`, answer: num};
            case 2:
                return {question: `${num} + ${num1} (roman numeral)`, answer: this.toRoman(num + num1)};
            case 3:
                return {question: `${this.toRoman(num)} + ${this.toRoman(num1)} (arabic numeral)`, answer: num + num1};
        }
    }

    toRoman(num: number) {
        let result = '';
        let decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        let roman = ["M", "CM","D","CD","C", "XC", "L", "XL", "X","IX","V","IV","I"];
        for (let i = 0;i<=decimal.length;i++) {
          while (num%decimal[i] < num) {     
            result += roman[i];
            num -= decimal[i];
          }
        }
        return result;
    }

    generateUnitConversionQuestion() {
        let choice = this.randomInteger(0, 1);
        switch(choice) {
            case 0:
                let num = this.randomInteger(2, 12);
                return {question: `${num * 15} miles per hour (in minutes per second)`, answer: num * 22};
            case 1:
                return this.generateMileConversionQuestion();
            case 2:
                let num1 = this.randomInteger(2, 12);
                return {question: `${num1 * 5} feet per minute (in inches per second)`, answer: num1};
            case 3:
                let num2 = this.randomInteger(12, 50);
                return {question: `${num2} inches per second (in feet per minute)`, answer: num2 * 5};
            case 4:
                let num3 = this.randomInteger(1, 6);
                return {question: `${num3} gallons (in cubic inches)`, answer: num3 * 231};
            
        }
    }

    generateMileConversionQuestion() {
        let choice = this.randomInteger(0, 3);
        switch(choice) {
            case 0:
                return {question: '12.5% of a mile is how many yards', answer: 220};
            case 1:
                return {question: '12.5% of a mile is how many feet', answer: 660};
            case 2:
                return {question: '25% of a mile is how many feet', answer: 1320};
            case 3:
                return {question: '25% of a mile is how many yards', answer: 440};
            case 2:
                return {question: '1/3 of a mile is how many feet', answer: 1760};
            case 3:
        }
    }

    gcd(x: number, y: number) {
        while(y) {
          let t = y;
          y = x % y;
          x = t;
        }
        return x;
      }

    generateSection2Question() {
        return {question: 'not developed yet.', answer: null};
    }

    generateSection3Question() {
        return {question: 'not developed yet.', answer: null};
    }

    generateSection4Question() {
        return {question: 'not developed yet.', answer: null};
    }

    generateSection5Question() {
        return {question: 'not developed yet.', answer: null};
    }


    questionAnswered(){
        this.question = this.generateQuestion();
        this.score += 1;
    }

    calculateScore()  {
        this.score = this.questionsCorrectlyAnswered * 5  - this.questionsMissed * 4;
    }

    numberSenseQuestionAnswered() {
        this.question = this.generateQuestion();
        this.questionsCorrectlyAnswered++;
        this.calculateScore();
    }

    questionMissed() {
        this.question = this.generateQuestion();
        this.questionsMissed++;
        this.calculateScore();
    }

    skipQuestion() {
        this.question = this.generateQuestion();
        this.questionsMissed++;
        this.calculateScore();
    }

    ngOnDestroy() {
        this.intervalSubscription.unsubscribe();
        clearTimeout(this.intervalTimer);
        this.choices = [];
        this.score = 0;
    }
}