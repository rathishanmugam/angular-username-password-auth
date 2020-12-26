import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from "../auth.service";
export interface User {
  id?: number;
  userName?: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public newUserForm: FormGroup;
  localData: User;
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
  }
  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  get password() {
    return this.newUserForm.get('password');
  }

  get email() {
    return this.newUserForm.get('email');
  }

  login() {
    const email = this.newUserForm.get('email').value;
    const password = this.newUserForm.get('password').value;
    console.log('the form data', email, password);
    this.authService.login(email, password);
  }

  signup() {
    this.router.navigate(['signup']);
  }
}
