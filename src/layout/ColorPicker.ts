export default class ColorPicker {
  private colors: string[] = ['#a45a2a', "#da291c", "#ffcd00", "#007a33", "#e89cae", "#7c878e", "#840b55", "#000000", "#10069f", "#00a3e0", "#6eceb2"];


  constructor() {
  }

  public getNext(): string{
    return this.colors.pop();
  }

}
