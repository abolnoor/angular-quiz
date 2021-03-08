import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/user';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user!: User;
  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private usersService: UsersService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const userId = Number(params.get('id'));
        return  this.usersService.getUserById(userId);
      })
    ).subscribe(response => this.user = response.data);
  }

  gotoBack() {
    this.location.back();
  }

}
