import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../userService';
import { ActivatedRoute, Route } from '@angular/router';
import { User } from '../user';
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: User;
  editProfile = "false";
  profileContent;
  uploadPhoto = "false";
  constructor(private userService: UserService, private route: ActivatedRoute) {
  }
  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      await this.userService.getUser(params.get('id')).subscribe(response => {
        this.user = response;
        this.profileContent = `Hello I'm ${this.user.firstName} and my age is ${this.user.age}.`
      });
    })
  }

  editUserProfile() {
    this.editProfile = "true";
  }

  saveProfile() {
    this.editProfile = "false";
  }

  editPhoto() {
    this.uploadPhoto = "true";
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.user.img = img;
      this.userService.uploadPhoto(this.user.id, this.user.img)
    });
  }
}
