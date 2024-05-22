import { Routes } from '@angular/router';
import { ToolboxComponent } from './toolbox/toolbox.component';
import {
  MockData,
  MockDataColumn,
  MockDataComponent,
} from './mock-data/mock-data.component';
import { FumogramComponent } from './diagram/fumogram.component';
import { PackinfoComponent } from './doc/packinfo/packinfo.component';
import { DbinfoComponent } from './doc/dbinfo/dbinfo.component';
import { CaseinfoComponent } from './doc/caseinfo/caseinfo.component';
import { PjtestComponent } from './doc/pjtest/pjtest.component';
import { ActogramComponent } from './diagram/actogram.component';
import { ErgramComponent } from './diagram/ergram.component';
import { DaoFactoryComponent } from './codegen/dao-factory.component';
import { DaoComponent } from './codegen/dao.component';
import { DaoImplComponent } from './codegen/dao-impl.component';
import { EntityComponent } from './codegen/entity.component';
import { ControllerComponent } from './codegen/controller.component';
import { ServiceComponent } from './codegen/service.component';
import { MapperComponent } from './codegen/mapper.component';
import { ServletComponent } from './codegen/servlet.component';
import { SqlComponent } from './codegen/sql.component';
import { EditJspComponent } from './codegen/jsp-edit.component';
import { InsertJspComponent } from './codegen/jsp-insert.component';
import { SelectJspComponent } from './codegen/jsp-select.component';
import { PaperComponent } from './paper/paper.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { PaperFormatComponent } from './paper-format/paper-format.component';

export const routes: Routes = [
  { path: 'mock-data', component: MockDataComponent },
  { path: 'dao-factory', component: DaoFactoryComponent },
  { path: 'dao-impl', component: DaoImplComponent },
  { path: 'dao', component: DaoComponent },
  { path: 'entity', component: EntityComponent },
  { path: 'controller', component: ControllerComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'mapper', component: MapperComponent },
  { path: 'servlet', component: ServletComponent },
  { path: 'sql', component: SqlComponent },
  { path: 'jsp-edit', component: EditJspComponent },
  { path: 'jsp-insert', component: InsertJspComponent },
  { path: 'jsp-select', component: SelectJspComponent },
  { path: 'packinfo', component: PackinfoComponent },
  { path: 'dbinfo', component: DbinfoComponent },
  { path: 'pjtest', component: PjtestComponent },
  { path: 'caseinfo', component: CaseinfoComponent },
  { path: 'home', component: ToolboxComponent },
  { path: 'toolbox', component: ToolboxComponent },
  { path: 'fumogram', component: FumogramComponent },
  { path: 'ergram', component: ErgramComponent },
  { path: 'actogram', component: ActogramComponent },
  { path: 'paper', component: PaperComponent },
  { path: 'attachment', component: AttachmentComponent },
  { path: 'paper-format', component: PaperFormatComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
