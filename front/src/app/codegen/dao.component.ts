import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CodegenComponent } from './codegen.component';
import { Entity, Field, Project } from '../project';
import { capitalize, matchIdName, splitByReturn, splitBySpaces } from '../util';
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
import saveAs from 'file-saver';

@Component({
  selector: 'bl-dao',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './codegen.component.html',
  styles: ``,
})
export class DaoComponent extends CodegenComponent {
  override title = 'DAO 生成';
  override templateName: string = 'Dao.java';
}
