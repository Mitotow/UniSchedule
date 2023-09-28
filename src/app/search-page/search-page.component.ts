import { Component, OnInit } from '@angular/core';
import { ApiGroupsService } from '../api-groups.service';
import GroupSchedule from 'src/interfaces/GroupSchedule';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  public groups: GroupSchedule[] = [];
  public filteredGroups: GroupSchedule[] = []
  public inputState = "";

  constructor(private apiGroupsService: ApiGroupsService, private router : Router) {}
  ngOnInit(): void {
    this.apiGroupsService.getGroups().subscribe({
      next: (data: GroupSchedule[]) => {
        this.groups = data;
        this.filteredGroups = data;
      },
      error: (error) => {
        console.error('Uncaught error : ', error);
      }
    })
  }

  onInputChange(value:string) {
    this.inputState = value;
    this.filteredGroups = this.groups.filter(g => g.group.name[0].toLowerCase().includes(this.inputState.toLowerCase()));
  }

  debug() {
    console.debug('debug');
  }

  goTo(path:string) {
    this.router.navigate([path]);
  }
}
