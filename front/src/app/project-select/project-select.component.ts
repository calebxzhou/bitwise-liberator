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
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Project } from '../project';
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
    RouterModule,
  ],
  templateUrl: './project-select.component.html',
  providers: [CookieService],
})
export class ProjectSelectComponent implements OnInit {
  projects!: Project[];
  ngOnInit(): void {}
  constructor(private router: Router, private cookieService: CookieService) {
    let cookie = localStorage.getItem('projects');

    if (cookie) {
      try {
        this.projects = JSON.parse(cookie);

        console.log(this.projects);
      } catch (error) {
        alert('没有项目');
        this.router.navigate(['/project-create']);
      }
    } else {
      alert('没有项目');
      this.router.navigate(['/project-create']);
    }
  }
}
