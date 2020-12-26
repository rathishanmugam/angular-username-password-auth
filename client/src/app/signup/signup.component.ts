import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
export interface User {
  id?: number;
  userName: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  message = '';
  public newUserForm: FormGroup;
  localData: User;
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }
  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }
  get password() {
    return this.newUserForm.get('password');
  }
  get userName() {
    return this.newUserForm.get('userName');
  }
  get email() {
    return this.newUserForm.get('email');
  }
  login() {
    const name = this.newUserForm.get('userName').value;
    const email = this.newUserForm.get('email').value;
    const password = this.newUserForm.get('password').value;
    console.log('the form data', name, email, password);
    this.authService.signup(name, email, password);
    this.router.navigate(['login']);
  }

}
