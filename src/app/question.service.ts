import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject, Subscription, interval, BehaviorSubject } from 'rxjs';
import { NSSet } from './shared/set.model';

@Injectable({ providedIn: 'root' })
export class QuestionService implements OnInit, OnDestroy {
  form: any;
  type: string;
  choices: string[] = [];
  secondsLeft: number;
  score = 0;
  questionsCorrectlyAnswered = 0;
  questionsMissed = 0;
  question: { question: string; answer: string | number };
  intervalSubscription: Subscription;
  intervalTimer;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  onSubmitForm(form: NgForm, type: string) {
    this.form = form.value;
    this.type = type;
    if (this.type === 'arithmetic') {
      if (this.form.addition) this.choices.push('addition');
      if (this.form.subtraction) this.choices.push('subtraction');
      if (this.form.multiplication) this.choices.push('multiplication');
      if (this.form.division) this.choices.push('division');
    } else if (this.type === 'powers') {
      if (this.form.squares) this.choices.push('squares');
      if (this.form.cubes) this.choices.push('cubes');
      if (this.form.powers) this.choices.push('powers');
    } else {
      console.log('reached here');
      if (this.form.section1) this.choices.push('section1');
      if (this.form.section2) this.choices.push('section2');
      if (this.form.section3) this.choices.push('section3');
      if (this.form.section4) this.choices.push('section4');
      if (this.form.section5) this.choices.push('section5');
    }
    this.question = this.generateQuestion();
    let duration = +this.form.duration.split(' ')[0];
    this.secondsLeft = duration;
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.secondsLeft--;
    });
    this.intervalTimer = setTimeout(() => {
      this.router.navigate(['/test-end']);
    }, duration * 1000);
    console.log(this.form);
  }

  randomInteger(min: number, max: number) {
    let range = max - min + 1;
    return Math.floor(Math.random() * range + min);
  }

  generateQuestion(): { question: string; answer: any } {
    switch (this.type) {
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
    const num = this.randomInteger(2, 10);
    let exp = 0;
    switch (num) {
      case 2:
        exp = this.randomInteger(3, 13);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 3:
        exp = this.randomInteger(3, 8);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 4:
        exp = this.randomInteger(3, 7);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 5:
        exp = this.randomInteger(3, 6);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
      case 6:
      case 7:
      case 8:
      case 9:
        exp = this.randomInteger(3, 5);
        return { question: `${num} ^ ${exp} = `, answer: Math.pow(num, exp) };
    }
  }

  generateNumberSenseQuestion(): { question: string; answer: string | number } {
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
    return this.generateSection2Question();
  }

  generateSection1Question() {
    let choice = this.randomInteger(0, 40);
    let num = this.randomInteger(20, 1000);
    let num1,
      num2,
      num3 = 0;
    let nums = [];
    let divisors = n =>
      [...Array(n + 1).keys()]
        .slice(1)
        .reduce((s, a) => s + (!(n % a) && a), 0);
    switch (choice) {
      //multiplication tricks
      case 0:
        return { question: `${num} * 11 = `, answer: num * 11 };
      case 1:
        return { question: `${num} * 101 = `, answer: num * 101 };
      case 2:
        return { question: `${num} * 25 = `, answer: num * 25 };
      case 3:
        return { question: `${num} * 75 = `, answer: num * 75 };
      case 4:
        num1 = this.randomInteger(20, 100);
        num2 = this.randomInteger(20, 100);
        return { question: `${num1} * ${num2} = `, answer: num1 * num2 };
      case 5:
        num = this.randomInteger(3, 10);
        return {
          question: `${num * 10 + 5} ^ 2 = `,
          answer: Math.pow(num * 10 + 5, 2)
        };
      case 6:
        num = this.randomInteger(0, 10);
        num1 = this.randomInteger(20, 50);
        return {
          question: `${num1 - num} * ${num1 + num} = `,
          answer: (num1 - num) * (num1 + num)
        };
      case 7:
        num = this.randomInteger(11, 80);
        let reverse = parseInt('' + num.toString()[1] + num.toString()[0]);
        return { question: `${num} * ${reverse} = `, answer: num * reverse };
      case 8:
        num = this.randomInteger(11, 80);
        //error
        return {
          question: `${num} ^ 2 + ${num + 1} ^ 2 = `,
          answer: Math.pow(num, 2) + Math.pow(num + 1, 2)
        };
      case 9:
        num = this.randomInteger(100, 1000);
        num1 = this.randomInteger(100, 1000);
        num2 = this.randomInteger(100, 1000);
        return {
          question: `${num} + ${num1} + ${num2} = `,
          answer: num1 + num2 + num2
        };
      case 10:
        num1 = this.randomInteger(1, 13);
        num2 = this.randomInteger(1, 13);
        return {
          question: `${100 - num1} * ${100 - num2} = `,
          answer: (100 - num1) * (100 - num2)
        };
      case 11:
        num1 = this.randomInteger(1, 13);
        num2 = this.randomInteger(1, 13);
        return {
          question: `${100 + num1} * ${100 + num2} = `,
          answer: (100 + num1) * (100 + num2)
        };
      case 12:
        num1 = this.randomInteger(1, 13);
        num2 = this.randomInteger(1, 13);
        return {
          question: `${100 + num1} * ${100 - num2} = `,
          answer: (100 + num1) * (100 - num2)
        };

      //fractions
      case 13:
        let a = this.randomInteger(17, 40);
        let b = a + this.randomInteger(2, 5);
        return {
          question: `${a} * ${a}/${b} = (mixed number)`,
          answer: `${a + (a - b)} ${Math.pow(a - b, 2)}/${b}`
        };
      case 14:
        let a1 = this.randomInteger(3, 20);
        let b1 = this.randomInteger(3, 20);
        return {
          question: `${a1}/${b1} + ${b1}/${a1} = (mixed number)`,
          answer: `2 ${Math.pow(a1 - b1, 2)}/${a1 * b1}`
        };

      //remainders
      case 15:
        let remainderNums = [3, 4, 8, 9, 11];
        num = remainderNums[this.randomInteger(0, remainderNums.length)];
        num1 = this.randomInteger(300, 100000);
        return { question: `${num1} % ${num} = `, answer: num1 % num };

      //conversions
      //roman numeral <-> arabic numeral
      case 16:
        num = this.randomInteger(100, 999);
        num1 = this.randomInteger(100, 999);
        return {
          question: `${num} = (roman numeral)`,
          answer: this.toRoman(num)
        };
      case 17:
        num = this.randomInteger(100, 999);
        num1 = this.randomInteger(100, 999);
        return {
          question: `${this.toRoman(num)} = (arabic numeral)`,
          answer: num
        };
      case 18:
        num = this.randomInteger(100, 999);
        num1 = this.randomInteger(100, 999);
        return {
          question: `${num} + ${num1} = (roman numeral)`,
          answer: this.toRoman(num + num1)
        };
      case 19:
        num = this.randomInteger(20, 200);
        num1 = this.randomInteger(20, 200);
        return {
          question: `${this.toRoman(num)} + ${this.toRoman(
            num1
          )} = (arabic numeral)`,
          answer: num + num1
        };

      // velocity and capacity conversions
      case 20:
        num = this.randomInteger(2, 12);
        return {
          question: `${num * 15} miles per hour = (minutes per second)`,
          answer: num * 22
        };
      case 21:
        num = this.randomInteger(2, 12);
        return {
          question: `${num * 5} feet per minute = ( inches per second)`,
          answer: num
        };
      case 22:
        num = this.randomInteger(12, 50);
        return {
          question: `${num} inches per second = (feet per minute)`,
          answer: num * 5
        };
      case 23:
        num = this.randomInteger(1, 6);
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
        return { question: '25% of a mile = (feet', answer: 1320 };
      case 27:
        return { question: '25% of a mile = (yards)', answer: 440 };
      case 28:
        return { question: '1/3 of a mile = (feet)', answer: 1760 };

      //gcd and lcm
      case 29:
        num = this.randomInteger(10, 30);
        num1 = this.randomInteger(1, 10);
        num2 = this.randomInteger(1, 10);
        return {
          question: `The GCF of ${num * num1} and ${num * num2} = `,
          answer: this.gcd(num * num1, num * num2)
        };
      case 30:
        num = this.randomInteger(10, 30);
        num1 = this.randomInteger(1, 10);
        num2 = this.randomInteger(1, 10);
        num3 = this.randomInteger(1, 10);
        return {
          question: `The GCF of ${num * num1}, ${num * num2}, and ${num *
            num3} = `,
          answer: this.gcd(this.gcd(num * num1, num * num2), num * num3)
        };
      case 31:
        num = this.randomInteger(10, 30);
        num1 = this.randomInteger(1, 10);
        num2 = this.randomInteger(1, 10);
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
          nums.push(this.randomInteger(10, 30));
          total += nums[i];
        }
        return {
          question: `What is the arithmetic mean of ${nums.toString()}?`,
          answer: total / 4
        };
      case 36:
        nums = [];
        for (let i = 0; i < 5; i++) nums.push(this.randomInteger(10, 30));
        return {
          question: `What is the median of ${nums}?`,
          answer: nums.slice().sort()[3]
        };

      //integral divisors
      case 37:
        num = this.randomInteger(20, 100);
        return {
          question: `The sum of the positive integral divisors of ${num} = `,
          answer: divisors(num)
        };
      case 38:
        num = this.randomInteger(20, 300);
        return {
          question: `${num} has how many positive integral divisors?`,
          answer: this.divisors(num)
        };
      case 39:
        num = this.randomInteger(20, 300);
        return {
          question: `${num} has how many prime integral divisors?`,
          answer: this.primeDivisors(num)
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

  divisors(n: number) {
    let divisors = 0;
    let mod = n;
    while (mod > 0) {
      if (n % mod === 0) {
        divisors++;
      }
      mod--;
    }
    return divisors;
  }

  primeDivisors(n: number) {
    let divisors = 0;
    let mod = n;
    while (mod > 0) {
      if (n % mod === 0 && this.isPrime(n % mod)) {
        divisors++;
      }
      mod--;
    }
    return divisors;
  }

  isPrime(input: number) {
    let prime = true;
    for (let i = 2; i <= Math.sqrt(input); i++) {
      if (input % i == 0) {
        prime = false;
        break;
      }
    }
    return prime && input > 1;
  }

  lcm(a: number, b: number) {
    return (a * b) / this.gcd(a, b);
  }

  //section 2 questions
  generateSection2Question() {
    let choice = this.randomInteger(0, 8);
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
      //additive and multiplicative inverses
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
          answer: `${denominator}/${num}`
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
        set.fill(6, 65, 71);
        set1.fill(6, 65, 71);
        return {
          question: `${set} intersection ${set1} has how many elements?`,
          answer: set.intersection(set1).length
        };
      case 9:
        set.fill(6, 65, 72);
        set1.fill(6, 65, 72);
        return {
          question: `${set} union ${set1} has how many elements?`,
          answer: set.union(set1).length
        };
      case 10:
        set.fill(6, 65, 72);
        set1.fill(6, 65, 69);
        return {
          question: `${set} complement ${set1} has how many elements?`,
          answer: set.complement(set1).length
        };
      case 11:
        set.fill(this.randomInteger(3, 13), 65, 75);
        return {
          question: `${set} has how many proper subsets?`,
          answer: set.subsets(true)
        };
      case 12:
        set.fill(this.randomInteger(3, 13), 65, 75);
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
    }
  }

  // intersection(a, b) {
  //   let intersection = [];
  //   for (let elementA of a) {
  //     for (let elementB of b) {
  //       if (elementA === elementB) intersection.push(elementA);
  //     }
  //   }
  //   return intersection;
  // }

  // union(a, b) {
  //   let union = [];
  //   a.concat(b);
  //   for (let elementA of a)
  //     for (let elementUnion of union) {
  //       if (elementA !== elementUnion) union.push(elementA);
  //     }
  //   return union;
  // }

  // complement(a, b) {
  //   let complement = a.slice();
  //   complement.filter(el => {
  //     for (let elementB of b) if (el === elementB) return true;
  //     return false;
  //   });
  // }

  subsets(a, proper: boolean) {
    return proper ? Math.pow(2, a.length) - 1 : Math.pow(2, a.length);
  }

  generateSection3Question() {
    return { question: 'not developed yet.', answer: null };
  }

  generateSection4Question() {
    return { question: 'not developed yet.', answer: null };
  }

  generateSection5Question() {
    return { question: 'not developed yet.', answer: null };
  }

  questionAnswered() {
    this.question = this.generateQuestion();
    this.score += 1;
  }

  calculateScore() {
    this.score = this.questionsCorrectlyAnswered * 5 - this.questionsMissed * 4;
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

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
    clearTimeout(this.intervalTimer);
    this.choices = [];
    this.score = 0;
  }
}
