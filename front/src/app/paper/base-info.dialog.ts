import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SituPaper } from './situ-paper';

@Component({
  selector: 'bl-base-info-dialog',

  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: `./base-info.dialog.html`,
})
export class BaseInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BaseInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SituPaper
  ) {}
  onCancel(): void {
    this.dialogRef.close();
  }
  onSelectStudentImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.data.studentNameImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onSelectTeacherImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.data.teacherNameImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
