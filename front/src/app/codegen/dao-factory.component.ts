//数据访问对象工厂生成组件
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';

@Component({
  selector: 'bl-dao-factory',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class DaoFactoryComponent extends CodegenComponent {
  override title = 'DAO Factory生成';
  override templateName: string = 'DaoFactory.java';
  override singleFile = true;
}
