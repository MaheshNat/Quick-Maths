export class Fraction {
  constructor(
    public isMixedNumber: boolean,
    public numerator: number,
    public denominator: number,
    public mixed = 0
  ) {
    if (this.denominator < 0) {
      this.numerator *= -1;
      this.denominator *= -1;
    }
  }

  public toImproper(): Fraction {
    return !this.isMixedNumber
      ? null
      : new Fraction(
          false,
          this.mixed * this.denominator + this.numerator,
          this.denominator
        ).reduce();
  }

  public toMixedNumber(): Fraction {
    return this.isMixedNumber
      ? null
      : new Fraction(
          true,
          this.numerator % this.denominator,
          this.denominator,
          Math.floor(this.numerator / this.denominator)
        ).reduce();
  }

  public gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  public reduce(): Fraction {
    let gcd = this.gcd(this.numerator, this.denominator);
    if (!this.isMixedNumber)
      return new Fraction(false, this.numerator / gcd, this.denominator / gcd);
    else
      return new Fraction(
        true,
        this.numerator / gcd,
        this.denominator / gcd,
        this.mixed
      );
  }

  public add(frac: Fraction): Fraction {
    let newNum = this.mixed * this.denominator + this.numerator;
    let fracNewNum = frac.mixed * frac.denominator + frac.numerator;
    return new Fraction(
      false,
      newNum * frac.denominator + fracNewNum * this.denominator,
      this.denominator * frac.denominator
    ).reduce();
  }

  public subtract(frac: Fraction): Fraction {
    let newNum = this.mixed * this.denominator + this.numerator;
    let fracNewNum = frac.mixed * frac.denominator + frac.numerator;
    return new Fraction(
      false,
      newNum * frac.denominator - fracNewNum * this.denominator,
      this.denominator * frac.denominator
    ).reduce();
  }

  public multiply(frac: Fraction): Fraction {
    let newNum = this.mixed * this.denominator + this.numerator;
    let fracNewNum = frac.mixed * frac.denominator + frac.numerator;
    return new Fraction(
      false,
      newNum * fracNewNum,
      this.denominator * frac.denominator
    ).reduce();
  }

  public divide(frac: Fraction): Fraction {
    let newNum = this.mixed * this.denominator + this.numerator;
    let fracNewNum = frac.mixed * frac.denominator + frac.numerator;
    return new Fraction(
      false,
      newNum * frac.denominator,
      fracNewNum * this.denominator
    ).reduce();
  }

  public toString = (): string => {
    return this.isMixedNumber
      ? this.denominator === 1
        ? `${this.mixed + this.numerator}`
        : `${this.mixed} ${this.numerator}/${this.denominator}`
      : this.denominator === 1
      ? `${this.numerator}`
      : `${this.numerator}/${this.denominator}`;
  };
}
