import { Routes } from '@angular/router';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'project-select', component: ProjectSelectComponent },
  { path: 'project-create', component: ProjectCreateComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
