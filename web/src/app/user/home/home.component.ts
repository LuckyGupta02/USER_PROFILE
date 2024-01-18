import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { UserService } from '../userService';
import { Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isVisible = false;
  addressValue = null;
  inputVisible = false;
  loading = false;
  avatarUrl: string;
  myForm: FormGroup;
  addressVisible = false;
  intrests = [];
  inputValue = '';
  maxSize = 310;
  maxHeight = 325;
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private http: HttpClient,
    private service: UserService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      img: '',
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      contact: '',
      age: '',
      intrest: [],
      address: '',
      address1: '',
      address2: '',
    });
    this.selectCompany();
  }

  @ViewChild('inputElement') inputElement: ElementRef;


  handleClose(removedIntrest: {}): void {
    this.intrests = this.intrests.filter(intrest => intrest !== removedIntrest);
  }

  intrestTag(intrest: string): string {
    const isLongIntrest = intrest.length > 20;
    return isLongIntrest ? `${intrest.slice(0, 20)}...` : intrest;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.msg.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.loading = false;
      this.avatarUrl = img;
    });
  }

  handleInputConfirm(): void {
    this.inputValue = this.myForm.get('intrest').value;
    if (this.inputValue) {
      this.intrests = [...this.intrests, this.inputValue];
    }
    this.inputVisible = false;
    this.inputValue = '';
  }

  selectCompany(): void {
    const address = this.myForm.get('address').value;
    this.addressValue = address;
  }

  showRegistration(): void {
    this.isVisible = true;
  }

  containsNumber = (inputString: string): boolean => {
    // Use a regular expression to check if the string contains any digits
    const hasNumber = /\d/.test(inputString);

    return hasNumber;
  };

  async handleOk() {
    this.myForm.patchValue({
      intrest: this.intrests,
      img: this.avatarUrl
    });
    const formData = this.myForm.value;
    if (formData.firstName && !this.containsNumber(formData.firstName)) {
      await this.service.createUser(formData)
        .subscribe(response => {
          const userId = response.id;
          this.router.navigate([`/users/${userId}`]);
          // Handle success, navigate, or perform other actions
        }, error => {
          console.error('Error creating user:', error);
          // Handle error appropriately
        });
      this.isVisible = false;
    }
    else {
      alert("Invalid input")
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }


}
