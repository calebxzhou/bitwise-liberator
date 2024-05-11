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
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

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
}
