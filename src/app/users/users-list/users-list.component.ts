import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { User } from 'src/app/user';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  // animations: [
  //   trigger('hover', [
  //     state('active', style({
  //       'background-size': 'auto'
  //     })),
  //     state('inactive', style({
  //       'background-size': 'cover'
  //     })),
  //     transition('active => inactive', [
  //       animate('100ms 0.2ms ease-in-out')
  //     ]),
  //     transition('inactive => active', [
  //       animate('100ms 0.2ms ease-in-out')
  //     ]),
  //   ]),
  // ]
})
export class UsersListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'avatar', 'name', 'email'];
  dataSource: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isError= false;
  resultPageSize = 6;
  gridMode = true;
  activeIndex=-1;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private usersService: UsersService, private router: Router) {
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

  openUser(row: any) {
    this.router.navigate(['/users', row.id]);
  }

}
