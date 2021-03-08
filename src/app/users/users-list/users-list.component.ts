import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { User } from 'src/app/user';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'avatar', 'name', 'email'];
  dataSource: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isError= false;
  resultPageSize = 6;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private usersService: UsersService) {
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.usersService.listUsers(this.paginator.pageIndex + 1);
        }),
        map(response => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isError= false;
          this.resultsLength = response.total;
          this.resultPageSize = response.per_page;
          return response.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isError= true;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = data);

  }

}
