import { Directive, HostListener, ElementRef, Input } from '@angular/core';
@Directive({
  selector: '[allowedCharacters]',
})
export class InputAllowedCharactersDirective {
  @Input() allowedCharacters: string = '\\w';

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    return new RegExp(`^[${this.allowedCharacters}]*$`).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(
        new RegExp(`[^${this.allowedCharacters}]`, 'g'),
        ''
      );
      event.preventDefault();
    }, 100);
  }
}
