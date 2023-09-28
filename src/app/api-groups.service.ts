import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import GroupSchedule from 'src/interfaces/GroupSchedule';

@Injectable({
  providedIn: 'root'
})
export class ApiGroupsService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  public getGroups() : Observable<GroupSchedule[]> {
    const url = this.apiUrl+'/groups';
    return this.http.get<GroupSchedule[]>(url);
  }

  public getGroup(id:string) : Observable<GroupSchedule> {
    const url = this.apiUrl+`/groups/${id}`;
    return this.http.get<GroupSchedule>(url);
  }
}
