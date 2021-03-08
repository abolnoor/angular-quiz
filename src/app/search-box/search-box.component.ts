import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  myControl = new FormControl('', Validators.pattern('^[1-9]+$'));
  filteredOptions: User[] = [];

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.checkSearch();
  }

  checkSearch(){
    const sub= merge(this.myControl.valueChanges).pipe(
      startWith(''),
      switchMap((value) => {
        return value ? this.usersService.getUserById(Number(value)) :  observableOf({data:[]})
      }),
      map(response => {
        return response.data? [response.data] : [];
      }),
      catchError((e) => {        
        sub.unsubscribe();
        this.checkSearch();
        return observableOf([]);
      })
    ).subscribe(data => {
      this.filteredOptions = data;
    });
  }
  openUser(selected:any) {
    const userId= Number(selected.option.value);
    if(userId)
    this.router.navigate(['/users', selected.option.value]);
  }

}
