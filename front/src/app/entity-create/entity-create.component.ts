import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirtyErrorMatcher } from '../misc';
import { Entity, Field, FieldType } from '../project';
import { FieldCreateComponent } from '../field-create/field-create.component';

@Component({
  selector: 'bl-entity-create',
  standalone: true,
  templateUrl: './entity-create.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FieldCreateComponent,
    MatTableModule,
  ],
})
export class EntityCreateComponent implements OnInit {
  displayedColumns: string[] = ['name', 'id', 'type'];
  form!: FormGroup;
  fields: Field[] = [];
  matcher = new DirtyErrorMatcher();
  @Output() created = new EventEmitter<Entity>();
  dataSource = new MatTableDataSource<Field>(this.fields);
  submit() {
    if (this.form.valid) {
      this.created.emit(this.form.value as Entity);
    }
  }
  onFieldCreated(field: Field) {
    this.fields.push(field);
    this.dataSource.data = [...this.fields];
    console.log(this.fields);
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }
}
