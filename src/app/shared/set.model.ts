export class NSSet {
  constructor(public elements: string[]) {}

  public get length() {
    return this.elements.length;
  }

  public push(element: string) {
    this.elements.push(element);
  }

  public fill(length: number, lower: number, upper: number) {
    for (let i = 0; i < length; i++)
      this.push(String.fromCharCode(NSSet.randomInteger(lower, upper)));
  }

  public intersection(set: NSSet): NSSet {
    return new NSSet(
      [...this.elements].filter(element => {
        for (let el of set.elements) if (el === element) return true;
        return false;
      })
    ).removeDuplicates();
  }

  public union(set: NSSet): NSSet {
    let union = [...this.elements].concat(set.elements);
    return new NSSet(
      union.filter((item, index) => union.indexOf(item) === index).slice()
    );
  }

  public complement(set: NSSet): NSSet {
    return new NSSet(
      [...this.elements].filter(element => {
        for (let el of set.elements) if (el === element) return false;
        return true;
      })
    );
  }

  public subsets(proper: boolean) {
    return proper
      ? Math.pow(2, this.elements.length) - 1
      : Math.pow(2, this.elements.length);
  }

  public static randomInteger(min: number, max: number) {
    let range = max - min + 1;
    return Math.floor(Math.random() * range + min);
  }

  public toString = (): string => {
    return `{${this.elements}}`;
  };

  public removeDuplicates(): NSSet {
    return new NSSet(
      [...this.elements].filter(
        (item, index) => this.elements.indexOf(item) === index
      )
    );
  }
}
