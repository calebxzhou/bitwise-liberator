import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ParagraphDialogComponent } from './paragraph.dialog.';
import { PaperCite, SituPaperParagraph } from './situ-paper';

@Component({
  selector: 'bl-cite-dialog',
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
  templateUrl: './cite.dialog.html',
  styles: ``,
})
export class PaperCiteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PaperCiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaperCite
  ) {}
  onCancel(): void {
    this.dialogRef.close();
  }
}
