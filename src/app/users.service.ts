import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'https://reqres.in/api/users'

  constructor(private http: HttpClient) { }

  listUsers(pageIndex: number) {
    return this.http.get<any>(`${this.apiUrl}?page=${pageIndex}`);
  }
  getUserById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
