import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-JspUpdate',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class EditJspComponent extends CodegenComponent {
  override title = '修改页面 生成';
  override templateName: string = 'edit.jsp';
  override progLang: string = 'html';
}
