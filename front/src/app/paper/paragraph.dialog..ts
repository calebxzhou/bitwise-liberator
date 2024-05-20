import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './paragraph.dialog.html',
  styles: ``,
})
export class ParagraphDialogComponent {
  contentControl = new FormControl('', [
    Validators.required,
    this.startsWithNumberValidator(),
  ]);

  constructor(
    public dialogRef: MatDialogRef<ParagraphDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SituPaperParagraph
  ) {}
  onCancel(): void {
    this.dialogRef.close();
  }
  onImageLoaded(images: ImageItem[]) {
    this.data = new SituPaperParagraph('img', images[0]);
  }
  onTypeSelectionChange(event: MatRadioChange) {
    if (event.value === 'table') {
      this.data.content = `测试表包文件表数据库表
列1=33% 列2=33% 列3=33%
第一行第一列>>第一行第二列>>第一行第三列
第二行第一列>>第二行第二列>>第二行第三列
第三行第一列>>第三行第二列>>第三行第三列...`;
    }
  }
  startsWithNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const content = control.value;
      if (content && content.length > 0 && !isNaN(content[0])) {
        return { startsWithNumber: { value: control.value } };
      }
      return null;
    };
  }
}
