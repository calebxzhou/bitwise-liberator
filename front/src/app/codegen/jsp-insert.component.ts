import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-InsertJsp',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class InsertJspComponent extends CodegenComponent {
  override title = '新增页面 生成';
  override templateName: string = 'insert.jsp';
  override progLang: string = 'html';
}
