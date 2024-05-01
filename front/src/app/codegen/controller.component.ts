//控制器生成组件
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-controller',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class ControllerComponent extends CodegenComponent {
  override title = 'Controller 生成';
  override templateName: string = 'Controller.java';
}
