import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bl-toolbox',
  standalone: true,
  imports: [RouterModule, MatButton],
  templateUrl: './toolbox.component.html',
  styles: ``,
})
export class ToolboxComponent {}
