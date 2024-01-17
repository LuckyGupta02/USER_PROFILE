import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class UserService{

    url='http://127.0.0.1:3000';

  constructor(private httpClient: HttpClient) {
  }

  getUsers(){
    this.httpClient.get(this.url+'/users');
  }

  getUser(id:string): Observable<any>{
    console.log("service user id:", id);
    const user = this.httpClient.get(this.url+`/users/${id}`);
    console.log("service user", user);
    return user;
  }

  createUser(user:User): Observable<any> {
    const createUser = this.httpClient.post(this.url+'/users',user);
    return createUser;
  }

  uploadPhoto(id:any, img:any){
    this.httpClient.patch(this.url+`/users/${id}`,{
      where:{
        img: img
      }
    });

    return true
  }
}

