import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Column } from '../project';

@Component({
  selector: 'bl-column-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './column-create.component.html',
})
export class ColumnCreateComponent {
  @Output() columnCreated = new EventEmitter<Column>();
  columnForm = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    length: new FormControl(0, [Validators.required, Validators.min(1)]),
    type: new FormControl('', Validators.required),
  });

  submit() {
    if (this.columnForm.valid) {
      const column: Column = this.columnForm.value as Column;
      console.log(column);
      this.columnCreated.emit(column);
      // Output the Column object
      // You can also handle the Column object here as needed
    }
  }
}
