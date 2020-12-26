import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  user: any;
  users = [];

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    console.log('THE USER ====>', this.user);
    this.authService.getAllUsers().subscribe(user => {
      this.users = user.users;
      console.log('THE USERs array ====>', this.users);

    });

    // console.log('THE USER ====>', this.user.name);
    // let httpOptions = {
    //   headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    // };
    // this.http.get('/api/book', httpOptions).subscribe(data => {
    //   this.books = data;
    //   console.log(this.books);
    // }, err => {
    //   if(err.status === 401) {
    //     this.router.navigate(['login']);
    //   }
    // });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
