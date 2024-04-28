import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-SelectJsp',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class SelectJspComponent extends CodegenComponent {
  override title = '查询页面 生成';
  override templateName: string = 'select_all.jsp';
  override progLang: string = 'html';
}
