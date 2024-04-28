import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-sql',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class SqlComponent extends CodegenComponent {
  override title = 'SQL 生成';
  override templateName: string = 'sql';
  override progLang: string = `sql`;
  override singleFile: boolean = true;
}
