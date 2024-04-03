import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Project } from '../project';

@Component({
  selector: 'bl-project-home',
  standalone: true,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  templateUrl: './project-home.component.html',
  styles: ``,
})
export class ProjectHomeComponent implements OnInit {
  project!: Project;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let pid = params.get('projectId')!;
      let projects: Project[] = JSON.parse(localStorage.getItem('projects')!);
      this.project = projects.find((p) => p.id === pid)!;
    });
  }
}
