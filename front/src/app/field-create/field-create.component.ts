import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Column, Field, FieldType } from '../project';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirtyErrorMatcher } from '../misc';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'bl-field-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './field-create.component.html',
})
export class FieldCreateComponent implements OnInit {
  form!: FormGroup;
  matcher = new DirtyErrorMatcher();
  @Output() created = new EventEmitter<Field>();
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      type: new FormControl(FieldType.Text, [Validators.required]),
    });
  }
  submit() {
    if (this.form.valid) {
      const val = this.form.value as Field;
      this.created.emit(val);
    }
  }
}
