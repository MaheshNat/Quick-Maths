export class NSSet {
  constructor(public elements: Array<string>) {}

  public get length() {
    return this.elements.length;
  }

  public push(element: string) {
    this.elements.push(element);
  }

  public fill(length: number, lower: number, upper: number) {
    for (let i = 0; i < length; i++)
      this.push(String.fromCharCode(NSSet.randomInteger(65, 72)));
  }

  public intersection(set: NSSet): NSSet {
    let intersection = new NSSet([]);
    for (let elementA of this.elements) {
      for (let elementB of set.elements) {
        if (elementA === elementB) intersection.push(elementA);
      }
    }
    return intersection;
  }

  public union(set: NSSet): NSSet {
    let union = new NSSet([]);
    this.elements.concat(set.elements);
    for (let elementA of this.elements)
      for (let elementUnion of union.elements) {
        if (elementA !== elementUnion) union.push(elementA);
      }
    return union;
  }

  public complement(set: NSSet): NSSet {
    let complement = new NSSet(this.elements.slice());
    complement.elements.filter(el => {
      for (let elementB of set.elements) if (el === elementB) return true;
      return false;
    });
    return complement;
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
}
