import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject, Subscription, interval, BehaviorSubject } from 'rxjs';
import { NSSet } from './shared/set.model';
import { Fraction } from './shared/fraction.model';

@Injectable({ providedIn: 'root' })
export class QuestionService implements OnInit, OnDestroy {
  form: any;
  test: string;
  choices: string[] = [];
  secondsLeft: number;
  score = 0;
  questionsCorrectlyAnswered = 0;
  questionsMissed = 0;
  question: { question: string; answer: string | number };
  intervalSubscription: Subscription;
  intervalTimer;
  questionNumber = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  reset() {
    this.score = 0;
    this.questionsCorrectlyAnswered = 0;
    this.questionsMissed = 0;
  }

  async startTest() {
    this.reset();
    await new Promise((resolve, reject) => {
      this.question = this.generateQuestion();
      console.log(
        `question: ${this.question.question}, answer: ${this.question.answer}`
      );
      resolve();
    });
    let duration = +this.form.duration.split(' ')[0];
    this.secondsLeft = duration;
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.secondsLeft--;
    });
    this.intervalTimer = setTimeout(() => {
      this.router.navigate(['/test-end']);
    }, duration * 1000);
  }

  async onSubmitForm(form: NgForm, test: string) {
    this.form = form.value;
    this.test = test;
    if (this.test === 'arithmetic') {
      if (this.form.addition) this.choices.push('addition');
      if (this.form.subtraction) this.choices.push('subtraction');
      if (this.form.multiplication) this.choices.push('multiplication');
      if (this.form.division) this.choices.push('division');
    } else if (this.test === 'powers') {
      if (this.form.squares) this.choices.push('squares');
      if (this.form.cubes) this.choices.push('cubes');
      if (this.form.powers) this.choices.push('powers');
    } else {
      if (this.form.section1) this.choices.push('section1');
      if (this.form.section2) this.choices.push('section2');
      if (this.form.section3) this.choices.push('section3');
    }
    await this.startTest();
    console.log('submitted form, test started.');
    console.log(
      'question: ' +
        this.question.question +
        ', answer: ' +
        this.question.answer
    );
  }

  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateQuestion(): { question: string; answer: any } {
    switch (this.test) {
      case 'arithmetic':
        return this.generateArithmeticQuestion();
      case 'powers':
        return this.generatePowersQuestion();
      case 'number-sense':
        console.log('number-sense generateQuestion() called');
        return this.generateNumberSenseQuestion();
    }
  }

  generateArithmeticQuestion(): { question: string; answer: any } {
    let choice = this.choices[this.randomInteger(0, this.choices.length - 1)];
    switch (choice) {
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
    let num1 = this.randomInteger(
      this.form.addition1Min,
      this.form.addition1Max
    );
    let num2 = this.randomInteger(
      this.form.addition2Min,
      this.form.addition2Max
    );
    return { question: num1 + ' + ' + num2 + ' =', answer: num1 + num2 };
  }

  generateSubtractionQuestion() {
    let num1 = this.randomInteger(
      this.form.addition1Min,
      this.form.addition1Max
    );
    let num2 = this.randomInteger(
      this.form.addition2Min,
      this.form.addition2Max
    );
    return { question: num1 + num2 + ' - ' + num2 + ' =', answer: num1 };
  }

  generateMultiplicationQuestion() {
    let num1 = this.randomInteger(
      this.form.multiplication1Min,
      this.form.multiplication1Max
    );
    let num2 = this.randomInteger(
      this.form.multiplication2Min,
      this.form.multiplication2Max
    );
    return { question: num1 + ' x ' + num2 + ' =', answer: num1 * num2 };
  }

  generateDivisionQuestion() {
    let num1 = this.randomInteger(
      this.form.multiplication1Min,
      this.form.multiplication1Max
    );
    let num2 = this.randomInteger(
      this.form.multiplication2Min,
      this.form.multiplication2Max
    );
    return { question: num1 * num2 + ' / ' + num2 + ' =', answer: num1 };
  }

  generatePowersQuestion(): { question: string; answer: string | number } {
    let choice = this.choices[this.randomInteger(0, this.choices.length - 1)];
    switch (choice) {
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
    return { question: `${num} ^ 2 = `, answer: Math.pow(num, 2) };
  }

  generateCubesQuestion() {
    let num = this.randomInteger(this.form.cubesMin, this.form.cubesMax);
    return { question: `${num} ^ 3 = `, answer: Math.pow(num, 3) };
  }

  generatePowersQuestion_() {
    // powers of 3 from 3 to 8, powers of 4 from 3 to 6, powers of 5 from 3 to 5, and powers of 6, 7, 8, and 9 from 3 to 4
    const num = this.randomInteger(2, 9);
    let exp = 0;
    switch (num) {
      case 2:
        exp = this.randomInteger(3, 12);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 3:
        exp = this.randomInteger(3, 7);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 4:
        exp = this.randomInteger(3, 6);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 5:
        exp = this.randomInteger(3, 5);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 6:
      case 7:
      case 8:
      case 9:
        exp = this.randomInteger(3, 4);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
    }
  }

  generateNumberSenseQuestion(): { question: string; answer: string | number } {
    if (
      this.choices.indexOf('section1') === -1 ||
      this.choices.indexOf('section2') === -1 ||
      this.choices.indexOf('section3') === -1
    ) {
      let choice = this.choices[this.randomInteger(0, this.choices.length)];
      switch (choice) {
        case 'section1':
          return this.generateSection1Question();
        case 'section2':
          return this.generateSection2Question();
        case 'section3':
          return this.generateSection3Question();
      }
    }
    if (this.questionNumber <= 20) return this.generateSection1Question();
    else if (this.questionNumber <= 40) return this.generateSection2Question();
    else if (this.questionNumber <= 60) return this.generateSection3Question();
    else this.router.navigate(['/test-end']);
  }

  generateSection1Question() {
    let choice = this.randomInteger(0, 39);
    let num = this.randomInteger(20, 999);
    let num1,
      num2,
      num3 = 0;
    let nums = [];
    switch (choice) {
      //multiplication tricks
      case 0:
        return { question: `${num} * 11 = `, answer: num * 11 };
      case 1:
        return { question: `${num} * 101 = `, answer: num * 101 };
      case 2:
        return { question: `${num} * 25 = `, answer: num * 25 };
      case 3:
        num = 4 * this.randomInteger(5, 249);
        return { question: `${num} * 75 = `, answer: num * 75 };
      case 4:
        num1 = this.randomInteger(20, 99);
        num2 = this.randomInteger(20, 99);
        return { question: `${num1} * ${num2} = `, answer: num1 * num2 };
      case 5:
        num = this.randomInteger(3, 9);
        return {
          question: `${num * 10 + 5} ^ 2 = `,
          answer: Math.pow(num * 10 + 5, 2)
        };
      case 6:
        num = this.randomInteger(0, 9);
        num1 = this.randomInteger(20, 49);
        return {
          question: `${num1 - num} * ${num1 + num} = `,
          answer: (num1 - num) * (num1 + num)
        };
      case 7:
        num = this.randomInteger(11, 79);
        let reverse = parseInt('' + num.toString()[1] + num.toString()[0]);
        return { question: `${num} * ${reverse} = `, answer: num * reverse };
      case 8:
        num = this.randomInteger(11, 79);
        //error
        return {
          question: `${num} ^ 2 + ${num + 1} ^ 2 = `,
          answer: Math.pow(num, 2) + Math.pow(num + 1, 2)
        };
      case 9:
        num = this.randomInteger(100, 999);
        num1 = this.randomInteger(100, 999);
        num2 = this.randomInteger(100, 999);
        return {
          question: `${num} + ${num1} + ${num2} = `,
          answer: num + num1 + num2
        };
      case 10:
        num1 = this.randomInteger(1, 12);
        num2 = this.randomInteger(1, 12);
        return {
          question: `${100 - num1} * ${100 - num2} = `,
          answer: (100 - num1) * (100 - num2)
        };
      case 11:
        num1 = this.randomInteger(1, 12);
        num2 = this.randomInteger(1, 12);
        return {
          question: `${100 + num1} * ${100 + num2} = `,
          answer: (100 + num1) * (100 + num2)
        };
      case 12:
        num1 = this.randomInteger(1, 12);
        num2 = this.randomInteger(1, 12);
        return {
          question: `${100 + num1} * ${100 - num2} = `,
          answer: (100 + num1) * (100 - num2)
        };

      //fractions
      case 13:
        let a = this.randomInteger(17, 39);
        let b = a + this.randomInteger(2, 5);
        return {
          question: `${a} * ${a}/${b} = (mixed number)`,
          answer: new Fraction(true, Math.pow(a - b, 2), b, a + (a - b))
            .reduce()
            .toString()
        };
      case 14:
        let a1 = this.randomInteger(3, 10);
        let b1;
        do {
          b1 = this.randomInteger(3, 10);
        } while (a1 === b1);
        return {
          question: `${a1}/${b1} + ${b1}/${a1} = (mixed number)`,
          answer: new Fraction(true, Math.pow(a1 - b1, 2), a1 * b1, 2)
            .reduce()
            .toString()
        };

      //remainders
      case 15:
        let remainderNums = [3, 4, 8, 9, 11];
        num = remainderNums[this.randomInteger(0, remainderNums.length - 1)];
        num1 = this.randomInteger(300, 99999);
        return { question: `${num1} % ${num} = `, answer: num1 % num };

      //conversions
      //roman numeral <-> arabic numeral
      case 16:
        num = this.randomInteger(100, 999);
        return {
          question: `${num} = (roman numeral)`,
          answer: this.toRoman(num)
        };
      case 17:
        num = this.randomInteger(100, 999);
        return {
          question: `${this.toRoman(num)} = (arabic numeral)`,
          answer: num
        };
      case 18:
        num = this.randomInteger(100, 499);
        num1 = this.randomInteger(100, 499);
        return {
          question: `${num} + ${num1} = (roman numeral)`,
          answer: this.toRoman(num + num1)
        };
      case 19:
        num = this.randomInteger(20, 199);
        num1 = this.randomInteger(20, 199);
        return {
          question: `${this.toRoman(num)} + ${this.toRoman(
            num1
          )} = (arabic numeral)`,
          answer: num + num1
        };

      // velocity and capacity conversions
      case 20:
        num = this.randomInteger(2, 11);
        return {
          question: `${num * 15} miles per hour = (minutes per second)`,
          answer: num * 22
        };
      case 21:
        num = this.randomInteger(2, 11);
        return {
          question: `${num * 5} feet per minute = (inches per second)`,
          answer: num
        };
      case 22:
        num = this.randomInteger(12, 49);
        return {
          question: `${num} inches per second = (feet per minute)`,
          answer: num * 5
        };
      case 23:
        num = this.randomInteger(1, 4);
        return {
          question: `${num} gallons = (cubic inches)`,
          answer: num * 231
        };

      // mile conversions
      case 24:
        return { question: '12.5% of a mile = (yards)', answer: 220 };
      case 25:
        return { question: '12.5% of a mile = (feet)', answer: 660 };
      case 26:
        return { question: '25% of a mile = (feet)', answer: 1320 };
      case 27:
        return { question: '25% of a mile = (yards)', answer: 440 };
      case 28:
        return { question: '1/3 of a mile = (feet)', answer: 1760 };

      //gcd and lcm
      case 29:
        num = this.randomInteger(10, 29);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(1, 9);
        return {
          question: `The GCF of ${num * num1} and ${num * num2} = `,
          answer: this.gcd(num * num1, num * num2)
        };
      case 30:
        num = this.randomInteger(10, 29);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(1, 9);
        num3 = this.randomInteger(1, 9);
        return {
          question: `The GCF of ${num * num1}, ${num * num2}, and ${num *
            num3} = `,
          answer: this.gcd(this.gcd(num * num1, num * num2), num * num3)
        };
      case 31:
        num = this.randomInteger(10, 29);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(1, 9);
        return {
          question: `The LCM of ${num * num1} and ${num * num2} = `,
          answer: this.lcm(num * num1, num * num2)
        };

      //fraction <-> decimal <-> percent
      case 32:
        num = this.randomInteger(1, 6);
        return {
          question: `${num} / 7 = (decimal)`,
          answer:
            ('' + num / 7).substring(0, 2) +
            '(' +
            ('' + num / 7).substring(2, 8) +
            ')'
        };
      case 33:
        num = this.randomInteger(1, 7);
        return { question: `${num} / 8 = (decimal)`, answer: num / 8 };
      case 34:
        num = this.randomInteger(1, 5);
        let answer =
          num === 1
            ? '.1(6)'
            : num === 2
            ? '.(3)'
            : num === 3
            ? '.5'
            : num === 4
            ? '.(6)'
            : num === 5
            ? '.8(3)'
            : null;
        return { question: `${num} / 6 = (decimal)`, answer: answer };

      //mean, median, and mode
      case 35:
        let total = 0;
        nums = [];
        for (let i = 0; i < 4; i++) {
          nums.push(this.randomInteger(5, 15) * 2);
          total += nums[i];
        }
        return {
          question: `What is the arithmetic mean of ${nums.toString()}? (decimal)`,
          answer: total / 4
        };
      case 36:
        nums = [];
        for (let i = 0; i < 5; i++) nums.push(this.randomInteger(10, 30));
        return {
          question: `What is the median of {${nums}}?`,
          answer: nums.slice().sort()[2]
        };

      //integral divisors
      case 37:
        num = 2 * this.randomInteger(10, 49);
        return {
          question: `The sum of the positive integral divisors of ${num} = `,
          answer: this.divisors(num).reduce((a, b) => a + b, 0)
        };
      case 38:
        num = 2 * this.randomInteger(10, 149);
        return {
          question: `${num} has how many positive integral divisors?`,
          answer: this.divisors(num).length
        };
      case 39:
        num = this.randomInteger(10, 149);
        return {
          question: `${num} has how many prime integral divisors?`,
          answer: this.primeDivisors(num).length
        };

      //extras
      case 40:
        num = this.randomInteger(1, 15);
        num1 = this.randomInteger(1, 15);
        num2 = this.randomInteger(1, 15);
        num3 = this.randomInteger(1, 15);
        return {
          question: `${num} / ${num1} + ${num2} / ${num3}`,
          answer: new Fraction(false, num, num1).add(
            new Fraction(false, num2, num3)
          )
        };

      //remainders of expressions
      case 41:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10) + num;
        num2 = this.randomInteger(2, 10) + num;
        num3 = this.randomInteger(2, 10) + num;
        return {
          question: `(${num1} * ${num2} + ${num3}) % ${num} = `,
          answer: (num1 * num2 + num3) % num3
        };
      case 42:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10) + num;
        num2 = this.randomInteger(2, 10) + num;
        num3 = this.randomInteger(2, 10) + num;
        return {
          question: `(${num1} * ${num2} * ${num3}) % ${num} = `,
          answer: (num1 * num2 * num3) % num3
        };
    }
  }

  //section 1 helper methods
  toRoman(num: number) {
    let result = '';
    let decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    let roman = [
      'M',
      'CM',
      'D',
      'CD',
      'C',
      'XC',
      'L',
      'XL',
      'X',
      'IX',
      'V',
      'IV',
      'I'
    ];
    for (let i = 0; i <= decimal.length; i++) {
      while (num % decimal[i] < num) {
        result += roman[i];
        num -= decimal[i];
      }
    }
    return result;
  }

  gcd(a: number, b: number) {
    if (b === 0) return a;
    else return this.gcd(b, a % b);
  }

  divisors(num: number): number[] {
    let nums: number[] = [];
    for (let i = 0; i < num; i++) if (num % i === 0) nums.push(i);
    console.log(nums);
    return nums.concat([num]);
  }

  primeDivisors(num: number): number[] {
    let primeFactors: number[] = [];
    while (num % 2 === 0) {
      primeFactors.push(2);
      num /= 2;
    }

    let sqrtNum = Math.sqrt(num);
    for (var i = 3; i <= sqrtNum; i++)
      while (num % i === 0) {
        primeFactors.push(i);
        num /= i;
      }

    if (num > 2) primeFactors.push(num);
    return primeFactors;
  }

  lcm(a: number, b: number) {
    return (a * b) / this.gcd(a, b);
  }

  //section 2 questions
  generateSection2Question() {
    let choice = this.randomInteger(0, 40);
    let num = 0,
      num1 = 0,
      num2 = 0,
      num3 = 0;
    let set = new NSSet([]),
      set1 = new NSSet([]);
    switch (choice) {
      //squares and cubes
      case 0:
        num = this.randomInteger(11, 50);
        return { question: `${num} ^ 2 = `, answer: Math.pow(num, 2) };
      case 1:
        num = this.randomInteger(5, 20);
        return { question: `${num} ^ 3 = `, answer: Math.pow(num, 3) };
      //inverses
      case 2:
        num = this.randomInteger(100, 10000);
        return {
          question: `What is the additive inverse of ${num}?`,
          answer: -num
        };
      case 3:
        num = this.randomInteger(100, 500);
        let denominator = this.randomInteger(100, 500);
        return {
          question: `What is the multiplicative inverse of ${num}/${denominator}?`,
          answer: new Fraction(false, denominator, num).reduce().toString()
        };
      //absolute value
      case 4:
        num = this.randomInteger(-20, 20);
        num1 = this.randomInteger(-20, 20);
        num2 = this.randomInteger(-20, 20);
        num3 = this.randomInteger(-20, 20);
        return {
          question: `${num} + ${num1} - |${num2}| + ${num3} = `,
          answer: num + num1 - Math.abs(num2) + num3
        };
      case 5:
        num = this.randomInteger(-20, 20);
        num1 = this.randomInteger(-20, 0);
        num2 = this.randomInteger(-20, 0);
        num3 = this.randomInteger(-20, 20);
        return {
          question: `${num} - |${num1}| + |${num2}| - ${num3} = `,
          answer: num - Math.abs(num1) + Math.abs(num2) - num3
        };
      //square and cube roots
      case 6:
        num = this.randomInteger(10, 50);
        return { question: `${Math.pow(num, 2)} ^ (1/2) = `, answer: num };
      case 7:
        num = this.randomInteger(5, 20);
        return { question: `${Math.pow(num, 3)} ^ (1/3) = `, answer: num };
      //sets
      case 8:
        set.fill(5, 65, 72);
        set1.fill(5, 65, 72);
        return {
          question: `${set} intersection ${set1} has how many elements?`,
          answer: set.intersection(set1).length
        };
      case 9:
        set.fill(5, 65, 72);
        set1.fill(5, 65, 72);
        return {
          question: `${set} union ${set1} has how many elements?`,
          answer: set.union(set1).length
        };
      case 10:
      case 11:
        set.fill(this.randomInteger(3, 12), 65, 75);
        return {
          question: `${set} has how many proper subsets?`,
          answer: set.subsets(true)
        };
      case 12:
        set.fill(this.randomInteger(3, 12), 65, 75);
        return {
          question: `${set} has how many subsets?`,
          answer: set.subsets(false)
        };
      case 13:
        set.fill(this.randomInteger(10, 20), 65, 75);
        return {
          question: `${set} has how many improper subsets?`,
          answer: 1
        };
      case 14:
        num = this.randomInteger(4, 12);
        return {
          question: `A set with ${Math.pow(
            2,
            num
          )} subsets has how many elements?`,
          answer: num
        };
      case 15:
        num = this.randomInteger(4, 12);
        return {
          question: `A set with ${Math.pow(2, num) -
            1} proper subsets has how many elements?`,
          answer: num
        };

      //base conversions
      case 16:
        num = this.randomInteger(20, 500);
        num1 = this.randomInteger(2, 9);
        return {
          question: `${this.convertBase(
            num,
            10,
            num1
          )} base ${num1} = (base 10)`,
          answer: num
        };
      case 17:
        num = this.randomInteger(20, 500);
        num1 = this.randomInteger(2, 9);
        do {
          num2 = this.randomInteger(2, 9);
        } while (num1 === num2);
        return {
          question: `${this.convertBase(
            num,
            10,
            num2
          )} base ${num2} = (base ${num1})`,
          answer: this.convertBase(num, 10, num1)
        };
      case 18:
        num = this.randomInteger(20, 99);
        num1 = this.randomInteger(20, 99);
        num2 = this.randomInteger(2, 9);
        return {
          question: `${this.convertBase(
            num,
            10,
            num2
          )} base ${num2} + ${this.convertBase(
            num1,
            10,
            num2
          )} base ${num2} = (base ${num2})`,
          answer: this.convertBase(num1 + num2, 10, num2)
        };
      case 19:
        num = this.randomInteger(20, 99);
        num1 = this.randomInteger(20, 99);
        num2 = this.randomInteger(2, 9);
        return {
          question: `${this.convertBase(
            num,
            10,
            num2
          )} base ${num2} - ${this.convertBase(
            num1,
            10,
            num2
          )} base ${num2} = (base ${num2})`,
          answer: this.convertBase(num1 - num2, 10, num2)
        };
      case 20:
        num = this.randomInteger(10, 29);
        num1 = this.randomInteger(10, 29);
        num2 = this.randomInteger(2, 9);
        return {
          question: `${this.convertBase(
            num,
            10,
            num2
          )} base ${num2} * ${this.convertBase(
            num1,
            10,
            num2
          )} base ${num2} = (base ${num2})`,
          answer: this.convertBase(num1 * num2, 10, num2)
        };
      case 21:
        let bases = [
          { from: 4, to: 2 },
          { from: 8, to: 2 },
          { from: 9, to: 3 }
        ];
        num = this.randomInteger(10, 99);
        let base = bases[this.randomInteger(0, bases.length - 1)];
        console.log(
          `number in base.from: ${this.convertBase(
            num,
            10,
            base.from
          )}, number in base.to: ${this.convertBase(num, 10, base.to)}`
        );
        return {
          question: `${this.convertBase(num, 10, base.from)} base ${
            base.from
          } = (base ${base.to})`,
          answer: this.convertBase(num, 10, base.to)
        };
      case 23:
        num = this.randomInteger(3, 9);
        num1 = this.randomInteger(1, num - 2);
        return {
          question: `.(${num1}) base ${num} = (base 10 fraction)`,
          answer: new Fraction(false, num1, num - 1).reduce().toString()
        };

      //repeating decimals to fraction
      case 24:
        num = this.randomInteger(1, 8);
        return {
          question: `.(${num}) = (fraction)`,
          answer: new Fraction(false, num, 9).reduce().toString()
        };
      case 25:
        num = this.randomInteger(10, 98);
        return {
          question: `.(${num}) = (fraction)`,
          answer: new Fraction(false, num, 99).reduce().toString()
        };
      case 26:
        num = this.randomInteger(100, 998);
        return {
          question: `.(${num}) = (fraction)`,
          answer: new Fraction(false, num, 999).reduce().toString()
        };
      case 27:
        num = this.randomInteger(1, 8);
        num1 = this.randomInteger(1, 9);
        return {
          question: `.${num}(${num1}) = (fraction)`,
          answer: new Fraction(false, num * 10 + num1 - num, 90)
            .reduce()
            .toString()
        };
      case 28:
        num = this.randomInteger(1, 8);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(1, 9);
        return {
          question: `.${num}(${num1}${num2}) = (fraction)`,
          answer: new Fraction(false, num * 100 + num1 * 10 + num2 - num, 990)
            .reduce()
            .toString()
        };

      //remainders
      case 29:
        let remainderNums = [3, 4, 8, 9, 11];
        num = remainderNums[this.randomInteger(0, remainderNums.length - 1)];
        num1 = this.randomInteger(300, 100000);
        return { question: `${num1} % ${num} = `, answer: num1 % num };

      //perimeter and area of polygons and circles
      case 30:
        num = this.randomInteger(10, 40);
        return {
          question: `A circle with area ${Math.pow(
            num,
            2
          )} * pi has a radius of (whole number / decimal)`,
          answer: num
        };
      case 31:
        num = this.randomInteger(10, 40);
        return {
          question: `A circle with perimeter ${num} * pi has a radius of (whole number / decimal)`,
          answer: num / 2
        };
      case 32:
        num = this.randomInteger(10, 40);
        num1 = this.randomInteger(10, 40);
        return {
          question: `A rectangle with width ${num} and height ${num1} has a perimeter of`,
          answer: 2 * num + 2 * num1
        };
      case 33:
        num = this.randomInteger(20, 40);
        num1 = this.randomInteger(20, 40);
        return {
          question: `A rectangle with width ${num} and height ${num1} has an area of`,
          answer: num * num1
        };
      case 34:
        num = this.randomInteger(10, 20);
        num1 = this.randomInteger(10, 20);
        num2 = this.randomInteger(2, 10);
        return {
          question: `A trapezoid with a base ${num}, another base ${num1}, and height ${num2} has an area of`,
          answer: ((num + num1) / 2) * num2
        };
      case 35:
        num = this.randomInteger(10, 50);
        num1 = this.randomInteger(10, 50);
        return {
          question: `A rhombus with diagonals ${num} and ${num1} has an area of`,
          answer: (num * num1) / 2
        };

      //sequences
      case 36:
        num = this.randomInteger(10, 30);
        return {
          question: `1 + 2 + 3 + ... + ${num} = `,
          answer: (num * (num + 1)) / 2
        };
      case 37:
        do {
          num = this.randomInteger(10, 30);
        } while (num % 2 === 0);
        return {
          question: `1 + 3 + 5 + ... + ${num} = `,
          answer: Math.pow((num + 1) / 2, 2)
        };
      case 38:
        do {
          num = this.randomInteger(10, 30);
        } while (num % 2 === 1);
        return {
          question: `2 + 4 + 6 + ... + ${num}`,
          answer: (num / 2) * (num / 2 + 1)
        };
      case 39:
        num = this.randomInteger(1, 9);
        num1 = this.randomInteger(1, 8);
        do {
          num2 = this.randomInteger(1, 9);
        } while (num2 <= num1);
        return {
          question: `${num}(1 + ${new Fraction(false, num1, num2)
            .reduce()
            .toString()} + ${new Fraction(
            false,
            Math.pow(num1, 2),
            Math.pow(num2, 2)
          )
            .reduce()
            .toString()} + ...) = `,
          answer: new Fraction(false, num, 1)
            .divide(
              new Fraction(false, 1, 1).subtract(
                new Fraction(false, num1, num2)
              )
            )
            .reduce()
            .toString()
        };
      case 40:
        num = this.randomInteger(1, 9);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(4, 20);
        return {
          question: `${num} + ${num + num1} + ${num + 2 * num1} + ... + ${num +
            num2 * num1} = `,
          answer: (num2 / 2) * (2 * num + (num2 - 1) * num1)
        };
    }
  }

  //section 2 helper methods
  convertBase(num: number, fromBase: number, toBase: number): number {
    console.log(
      `num: ${num}, fromBase: ${fromBase}, toBase: ${toBase}, converted: ${parseInt(
        num.toString(fromBase),
        toBase
      )}`
    );
    return parseInt(num.toString(toBase), fromBase);
  }

  generateSection3Question() {
    let choice = this.randomInteger(0, 46);
    let num = 0,
      num1 = 0,
      num2 = 0,
      num3 = 0;
    const powers = [
      { num: 2, min: 3, max: 12 },
      { num: 3, min: 3, max: 7 },
      { num: 4, min: 3, max: 6 },
      { num: 5, min: 3, max: 5 },
      { num: 6, min: 3, max: 4 },
      { num: 7, min: 3, max: 3 },
      { num: 8, min: 3, max: 4 },
      { num: 9, min: 3, max: 3 }
    ];
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
    const shapes = [
      'triangle',
      'square',
      'pentagon',
      'hexagon',
      'septagon',
      'octagon',
      'nonagon',
      'decagon'
    ];
    const binomial = [1, 1, 2, 9, 96, 2500];
    let sides = this.randomInteger(0, shapes.length - 1) + 3;
    let shape = shapes[sides - 3];
    let power;
    switch (choice) {
      //exponent rules
      case 0:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(10, 20);
        num2 = this.randomInteger(2, 3);
        return {
          question: `${num} ^ x = ${num1}, then ${num} ^ (x + ${num2}) = `,
          answer: num1 * Math.pow(num, num2)
        };
      case 1:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(10, 40);
        num2 = this.randomInteger(2, 3);
        return {
          question: `${num} ^ x = ${num1}, then ${num} ^ (x - ${num2}) = `,
          answer: new Fraction(false, num1, Math.pow(num, num2))
            .reduce()
            .toString()
        };
      case 2:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(10, 40);
        return {
          question: `${num} ^ x = ${num1}, then ${num} ^ 2x = `,
          answer: Math.pow(num1, 2)
        };
      case 3:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(5, 20);
        return {
          question: `${num} ^ x = ${num1}, then ${num} ^ 3x = `,
          answer: Math.pow(num1, 3)
        };

      //log rules
      case 4:
        power = powers[this.randomInteger(0, powers.length - 1)];
        num = this.randomInteger(power.min, power.max);
        return {
          question: `log base ${power.num} of ${Math.pow(power.num, num)} = `,
          answer: num
        };
      case 5:
        power = powers[this.randomInteger(0, powers.length - 1)];
        num = this.randomInteger(power.min, power.max);
        let divisors = this.divisors(Math.pow(power.num, num));
        return {
          question: `log base ${power.num} of ${
            divisors[divisors.length - 2]
          } + log base ${power.num} of ${Math.pow(power.num, num) /
            divisors[divisors.length - 2]} = `,
          answer: num
        };
      case 6:
        power = powers[this.randomInteger(0, powers.length - 1)];
        num = this.randomInteger(power.min, power.max);
        return {
          question: `log base x of ${Math.pow(power.num, num)} = ${num}, x = `,
          answer: power.num
        };
      case 7:
        power = powers[this.randomInteger(0, powers.length - 1)];
        num = this.randomInteger(power.min, power.max);
        num1 = this.randomInteger(3, 10);
        return {
          question: `log base ${power.num} of ${Math.pow(power.num, num) *
            num1} - log base ${power.num} of ${num1} = `,
          answer: num
        };

      //right triangle
      case 8:
        num = this.randomInteger(10, 30);
        num = num % 2 === 0 ? num + 1 : num;
        return {
          question: `The sides of a right triangle are integers. If one leg is ${num} then the other leg is`,
          answer: Math.floor(Math.pow(num, 2) / 2)
        };
      case 9:
        num = this.randomInteger(2, 12);
        num1 = this.randomInteger(2, 12);
        return {
          question: `An acute triangle has integer sides of ${num}, x, and ${num1}. What is the largest value of x?`,
          answer: Math.floor(Math.sqrt(Math.pow(num, 2) + Math.pow(num1, 2)))
        };
      case 9:
        num = this.randomInteger(2, 12);
        num1 = this.randomInteger(2, 12);
        return {
          question: `An obtuse triangle has integer sides of ${num}, x, and ${num1}. What is the largest value of x?`,
          answer: num + num1 - 1
        };

      //coordinate geometry
      case 10:
        num = this.randomInteger(1, 20);
        num1 = this.randomInteger(1, 20);
        num2 = this.randomInteger(1, 20);
        do {
          num2 = this.randomInteger(1, 20);
        } while (num === num2);
        return {
          question: `The slope between the points (${num}, ${num1}) and (${num2}, ${num3}) is`,
          answer: new Fraction(false, num1 - num3, num - num2)
            .reduce()
            .toString()
        };
      case 11:
        num = this.randomInteger(1, 20);
        num1 = this.randomInteger(1, 20);
        num2 = this.randomInteger(1, 20);
        do {
          num3 = this.randomInteger(1, 20);
        } while (num1 === num3);
        return {
          question: `The x coordinate of the midpoint between (${num}, ${num1}) and (${num2}, ${num3}) is`,
          answer: new Fraction(false, num + num2, 2).reduce().toString()
        };
      case 12:
        num = this.randomInteger(1, 20);
        num1 = this.randomInteger(1, 20);
        num2 = this.randomInteger(1, 20);
        do {
          num3 = this.randomInteger(1, 20);
        } while (num1 === num3);
        return {
          question: `The y coordinate of the midpoint between (${num}, ${num1}) and (${num2}, ${num3}) is`,
          answer: new Fraction(false, num1 + num3, 2).reduce().toString()
        };
      case 13:
        let triple = triples[this.randomInteger(0, triples.length - 1)];
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        return {
          question: `The distance between the point (${num}, ${num1}) and (${num +
            triple[0]}, ${num1 + triple[1]}) is`,
          answer: triple[2]
        };

      //regular polygons
      case 14:
        return {
          question: `A ${shape} has how many diagonals?`,
          answer: (sides * (sides - 3)) / 2
        };
      case 15:
        do {
          sides = this.randomInteger(0, shapes.length - 1) + 3;
        } while (sides === 4);
        shape = shapes[sides - 3];
        return {
          question: `A regular ${shape} has an exterior angle of`,
          answer: 360 / sides
        };
      case 16:
        do {
          sides = this.randomInteger(0, shapes.length - 1) + 3;
        } while (sides === 7);
        shape = shapes[sides - 3];
        return {
          question: `A regular ${shape} has an interior angle of`,
          answer: (180 * (sides - 2)) / sides
        };
      case 17:
        do {
          sides = this.randomInteger(0, shapes.length - 1) + 3;
        } while (sides === 4);
        shape = shapes[sides - 3];
        return {
          question: ` The sum of the interior angles of a regular ${shape} is`,
          answer: 180 * (sides - 2)
        };
      case 18:
        num = this.randomInteger(1, 10) * 2;
        return {
          question: `The sides of an equilateral triangle are ${num}√(3) cm, then its height is`,
          answer: new Fraction(false, num * 3, 2).reduce().toString()
        };

      //inequalities
      case 19:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question:
            this.randomInteger(0, 1) === 0
              ? `|${num}x + ${num1}| ≤ ${num2}, what is the greatest value of x?`
              : `|${num}x + ${num1}| ≥ ${num2}, what is the least value of x?`,
          answer: new Fraction(false, num2 - num1, num).reduce().toString()
        };
      case 20:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question:
            this.randomInteger(0, 1) === 0
              ? `|${num}x + ${num1}| ≤ ${num2}, what is the least value of x?`
              : `|${num}x + ${num1}| ≥ ${num2}, what is the greatest value of x?`,
          answer: new Fraction(false, -num2 - num1, num).reduce().toString()
        };

      //variation
      case 21:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question: `If y varies inversely with x and y equals ${num1} when x equals ${num}, then what is the value of y when x equals ${num2}`,
          answer: new Fraction(false, num * num1, num2).reduce().toString()
        };
      case 22:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question: `If y varies inversely with x and y equals ${num1} when x equals ${num}, then what is the value of x when y equals ${num2}`,
          answer: new Fraction(false, num * num1, num2).reduce().toString()
        };
      case 23:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question: `If y varies directly with x and y equals ${num1} when x equals ${num}, then what is the value of y when x equals ${num2}`,
          answer: new Fraction(false, num1 * num2, num).reduce().toString()
        };
      case 24:
        num = this.randomInteger(2, 20);
        num1 = this.randomInteger(2, 20);
        num2 = this.randomInteger(2, 20);
        return {
          question: `If y varies directly with x and y equals ${num1} when x equals ${num}, then what is the value of x when y equals ${num2}`,
          answer: new Fraction(false, num2 * num, num1).reduce().toString()
        };

      //sequences
      case 25:
        num = this.randomInteger(10, 30);
        return {
          question: `1 + 2 + 3 + ... + ${num} = `,
          answer: (num * (num + 1)) / 2
        };
      case 26:
        do {
          num = this.randomInteger(10, 30);
        } while (num % 2 === 0);
        return {
          question: `1 + 3 + 5 + ... + ${num} = `,
          answer: Math.pow((num + 1) / 2, 2)
        };
      case 27:
        do {
          num = this.randomInteger(10, 30);
        } while (num % 2 === 1);
        return {
          question: `2 + 4 + 6 + ... + ${num}`,
          answer: (num / 2) * (num / 2 + 1)
        };
      case 28:
        num = this.randomInteger(1, 9);
        num1 = this.randomInteger(1, 8);
        do {
          num2 = this.randomInteger(1, 9);
        } while (num2 <= num1);
        return {
          question: `${num}(1 + ${new Fraction(false, num1, num2)
            .reduce()
            .toString()} + ${new Fraction(
            false,
            Math.pow(num1, 2),
            Math.pow(num2, 2)
          )
            .reduce()
            .toString()} + ...) = `,
          answer: new Fraction(false, num, 1)
            .divide(
              new Fraction(false, 1, 1).subtract(
                new Fraction(false, num1, num2)
              )
            )
            .reduce()
            .toString()
        };
      case 29:
        num = this.randomInteger(1, 9);
        num1 = this.randomInteger(1, 9);
        num2 = this.randomInteger(4, 20);
        return {
          question: `${num} + ${num + num1} + ${num + 2 * num1} + ... + ${num +
            num2 * num1} = `,
          answer: (num2 / 2) * (2 * num + (num2 - 1) * num1)
        };

      //complex numbers
      case 30:
        num = this.randomInteger(2, 10);
        return {
          question: `if (${num} - i) ^ 2 = a + bi, then a + b = `,
          answer: Math.pow(num, 2) - 1 - 2 * num
        };
      case 31:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        num2 = this.randomInteger(2, 10);
        num3 = this.randomInteger(2, 10);
        return {
          question: `if (${num} + ${num1}i)(${num2} + ${num3}i) = a + bi, then a + b = `,
          answer: num * num2 - num1 * num3 + (num1 * num2 + num * num3)
        };
      case 32:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        return {
          question: `(${num} + ${num1}i)(${num} - ${num1}i) = `,
          answer: Math.pow(num, 2) + Math.pow(num1, 2)
        };

      //combinations and permutations
      case 33:
        num = this.randomInteger(3, 9);
        do {
          num1 = this.randomInteger(2, 9);
        } while (num1 >= num);
        return {
          question: `${num}C${num1} = `,
          answer:
            this.factorial(num) /
            (this.factorial(num1) * this.factorial(num - num1))
        };
      case 34:
        num = this.randomInteger(3, 6);
        do {
          num1 = this.randomInteger(2, 6);
        } while (num1 >= num);
        return {
          question: `${num}P${num1} = `,
          answer: this.factorial(num) / this.factorial(num - num1)
        };

      //probabiliy / odds
      case 35:
        num = this.randomInteger(2, 19);
        do {
          num1 = this.randomInteger(2, 20);
        } while (num1 <= num);
        return {
          question: `The probabiliy of winning is ${num}/${num1}. The odds of losing are (fraction)`,
          answer: new Fraction(false, num1 - num, num).reduce().toString()
        };
      case 36:
        num = this.randomInteger(2, 19);
        do {
          num1 = this.randomInteger(2, 20);
        } while (num1 <= num);
        return {
          question: `The odds of losing are ${num}/${num1}. The probabiliy of winning is (fraction)`,
          answer: new Fraction(false, num1, num + num1).reduce().toString()
        };

      //binomial expansion theorem
      case 37:
        num = this.randomInteger(-3, 11);
        do {
          num1 = this.randomInteger(-3, 11);
        } while (num + num1 < 2 || num + num1 > 9);
        console.log(`num: ${num}, num1: ${num1}, index: ${num + num1 - 3}`);
        num2 = this.randomInteger(
          powers[num + num1 - 2].min,
          powers[num + num1 - 2].max
        );
        return {
          question: `The sum of the coefficients in the expansion of (${num}x + ${num1}y) ^ ${num2} is`,
          answer: Math.pow(num + num1, num2)
        };
      case 38:
        num = this.randomInteger(0, binomial.length);
        return {
          question: `The product of the coefficients in the expansion of (x + y) ^ ${num} is`,
          answer: binomial[num]
        };

      //system of equations
      case 39:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        num2 = this.randomInteger(2, 10);
        num3 = this.randomInteger(2, 10);
        return {
          question: `If y = ${num}x + ${num1} and y = ${num2}x + ${num3}, then x = `,
          answer: new Fraction(false, num3 - num1, num - num2)
            .reduce()
            .toString()
        };
      case 40:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        num2 = this.randomInteger(2, 10);
        num3 = this.randomInteger(2, 10);
        return {
          question: `If ${num}x = ${num1} and y = ${num2}x + ${num3}, then y = `,
          answer: new Fraction(false, num2 * num1, num)
            .add(new Fraction(false, num3, 1))
            .reduce()
            .toString()
        };
      case 41:
        num = this.randomInteger(2, 10);
        num1 = this.randomInteger(2, 10);
        num2 = this.randomInteger(2, 10);
        do {
          num3 = this.randomInteger(2, 10);
        } while (num1 === num3);
        let num4 = this.randomInteger(2, 10);
        return {
          question: `If ${num}x + ${num1}y = ${num2} and ${num}x + ${num3}y = ${num4}, then y = `,
          answer: new Fraction(false, num2 - num4, num1 - num3)
            .reduce()
            .toString()
        };

      //quadratic equations
      case 42:
        num = this.randomInteger(2, 4);
        num1 = this.randomInteger(2, 4);
        num2 = this.randomInteger(2, 5);
        return {
          question: `f(x) = ${Math.pow(num, 2)}x^2 + ${2 *
            num *
            num1}x + ${Math.pow(num1, 2)}, f(1.${num2}) = `,
          answer: Math.pow(num * (1 + num2 / 10.0) + num1, 2)
        };

      //polygonal numbers
      case 43:
        num = this.randomInteger(2, 20);
        return {
          question: `The ${num}th triagonal number is`,
          answer: (num * (num + 1)) / 2
        };
      case 44:
        num = this.randomInteger(2, 20);
        return {
          question: `The ${num}th pentagonal number is`,
          answer: (num * (3 * num - 1)) / 2
        };
      case 45:
        num = this.randomInteger(2, 20);
        return {
          question: `The ${num}th hexagonal number is`,
          answer: (num * (4 * num - 2)) / 2
        };
      case 46:
        num = this.randomInteger(2, 20);
        return {
          question: `The ${num}th octagonal number is`,
          answer: (num * (6 * num - 4)) / 2
        };
    }
  }

  factorial(x: number) {
    return x === 1 ? 1 : x * this.factorial(x - 1);
  }

  questionAnswered() {
    this.question = this.generateQuestion();
    console.log(
      `question: ${this.question.question}, answer: ${this.question.answer}`
    );
    this.score += 1;
  }

  calculateScore() {
    this.score = this.questionsCorrectlyAnswered * 5 - this.questionsMissed * 4;
  }

  numberSenseQuestionAnswered() {
    this.question = this.generateQuestion();
    this.questionsCorrectlyAnswered++;
    this.calculateScore();
    this.questionNumber++;
  }

  questionMissed() {
    this.question = this.generateQuestion();
    this.questionsMissed++;
    this.calculateScore();
    this.questionNumber++;
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
    clearTimeout(this.intervalTimer);
    this.choices = [];
    this.score = 0;
  }
}
