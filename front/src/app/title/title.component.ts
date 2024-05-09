import { Component, Input } from '@angular/core';

@Component({
  selector: 'bl-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styles: ``,
})
export class TitleComponent {
  @Input() title!: string;
}
