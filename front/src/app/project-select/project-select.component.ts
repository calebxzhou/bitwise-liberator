import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { DirtyErrorMatcher } from '../misc';
import { getMongoIdValidator } from '../util';
@Component({
  selector: 'bl-project-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './project-select.component.html',
})
export class ProjectSelectComponent implements OnInit {
  ngOnInit(): void {
    this.form = new FormGroup({
      idField: new FormControl('', [
        Validators.required,
        getMongoIdValidator(),
      ]),
    });
  }
  form!: FormGroup;

  matcher = new DirtyErrorMatcher();
}
