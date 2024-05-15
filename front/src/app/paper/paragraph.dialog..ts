import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SituPaperParagraph } from './situ-paper';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioModule,
} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import {
  Column,
  FuncTest,
  ModuleTest,
  Project,
  Table,
  TestCase,
  UseCase,
} from '../project';
import { splitBySpaces } from '../util';
import {
  ImageItem,
  ImageSelectorComponent,
} from '../image-selector/image-selector.component';

@Component({
  selector: 'bl-paragraph-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatRadioModule,
    ImageSelectorComponent,
  ],
  templateUrl: './paragraph.dialog.html',
  styles: ``,
})
export class ParagraphDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ParagraphDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SituPaperParagraph
  ) {}
  onCancel(): void {
    this.dialogRef.close();
  }
  onImageLoaded(images: ImageItem[]) {
    this.data.type = 'img';
    this.data.contents = images;
  }
  onTypeSelectionChange(event: MatRadioChange) {
    if (event.value === 'table') {
      this.data.contents[0] = '列1=33% 列2=33% 列3=33%';
      this.data.contents[2] = '测试表包文件表数据库表';
      this.data.contents[1] =
        '第一行第一列>>第一行第二列>>第一行第三列\n第二行第一列>>第二行第二列>>第二行第三列\n第三行第一列>>第三行第二列>>第三行第三列...';
    }
  }
}
