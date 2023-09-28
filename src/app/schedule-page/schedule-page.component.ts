import { Component, OnInit } from '@angular/core';
import ICSEvent from 'src/interfaces/ICSEvent';
import { ApiGroupsService } from '../api-groups.service';
import { Router } from '@angular/router';
import GroupSchedule from 'src/interfaces/GroupSchedule';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss']
})
export class SchedulePageComponent implements OnInit {
  public schedule : ICSEvent[] = []

  constructor(private api:ApiGroupsService, private router:Router) { }

  ngOnInit(): void {
    var splitUrl = this.router.url.split('/');
    var id = splitUrl[splitUrl.length-1];
    this.api.getGroup(id).subscribe({
      next: (group : GroupSchedule) => {
        this.schedule = group.schedule;
      },
      error: () => {
        this.redirectTo('');
      }
    });
  }

  redirectTo = (path:string) => this.router.navigate([path]);
}
