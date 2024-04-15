import { Routes } from '@angular/router';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { HomeComponent } from './home/home.component';
import { ProjectHomeComponent } from './project-home/project-home.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import {
  MockData,
  MockDataColumn,
  MockDataComponent,
} from './mock-data/mock-data.component';
import { FumogramComponent } from './fumogram/fumogram.component';
import { DocDslTestComponent } from './doc-dsl-test/doc-dsl-test.component';
import { PackinfoComponent } from './packinfo/packinfo.component';
import { DbinfoComponent } from './dbinfo/dbinfo.component';
import { CaseinfoComponent } from './caseinfo/caseinfo.component';

export const routes: Routes = [
  { path: 'project-select', component: ProjectSelectComponent },
  { path: 'project-home', component: ProjectHomeComponent },
  { path: 'project-create', component: ProjectCreateComponent },
  { path: 'mock-data', component: MockDataComponent },
  { path: 'packinfo', component: PackinfoComponent },
  { path: 'dbinfo', component: DbinfoComponent },
  { path: 'caseinfo', component: CaseinfoComponent },
  { path: 'doc-dsl-test', component: DocDslTestComponent },
  { path: 'home', component: ToolboxComponent },
  { path: 'toolbox', component: ToolboxComponent },
  { path: 'fumogram', component: FumogramComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
