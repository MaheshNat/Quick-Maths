import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, ReplaySubject, Subscription, Subject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isAuthenticated = false;
  user: User = null;
  username: string;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string, username: string) {
    return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), 
      tap(resData => {
        this.username = username;
        this.handleAuthentication(
          resData.email,
          resData.localId, 
          resData.idToken,
          +resData.expiresIn
        );
        this.submitUsername(resData.localId, username);
      })
    );
  }

  submitUsername(id: string, username: string) { 
    let newUsernames = [];
    this.http.get<{id: string, username: string}[]>('https://quick-maths-417bb.firebaseio.com/usernames.json', {params: new HttpParams().set('auth', this.user.token)}).subscribe(
      usernames => {
        newUsernames.push({id: id, username: username});
        if(usernames)
          for({id, username} of usernames)
            newUsernames.push({id, username}); 

      this.http.put<{id: string, username: string}[]>('https://quick-maths-417bb.firebaseio.com/usernames.json', newUsernames).subscribe(
      usernames => {
        for({id, username} of newUsernames)
          console.log('id: ' + id + ', username: ' + username);
      });
    });
  }
  
  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      email, 
      userId, 
      token, 
      expirationDate
    );
    this.user = user;
    this.isAuthenticated = !!user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), 
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId, 
          resData.idToken,
          +resData.expiresIn
        );
        this.http.get<{id: string, username: string}[]>('https://quick-maths-417bb.firebaseio.com/usernames.json', 
        {params: new HttpParams().set('auth', this.user.token)}
        ).subscribe(
            usernames => {
              for(let username of usernames)
                if(username.id == resData.localId) {
                  this.username = username.username;
                }
            }
          )
        }
      )
    );
  }

  logout() {
    this.user = null;
    this.router.navigate(['/auth']);
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user'));
    if(!userData)
      return;
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token) {
      this.user = loadedUser;
      this.isAuthenticated = true;
      this.http.get<{id: string, username: string}[]>('https://quick-maths-417bb.firebaseio.com/usernames.json', 
        {params: new HttpParams().set('auth', this.user.token)}
        ).subscribe(
            usernames => {
              for(let username of usernames)
                if(username.id == this.user.id) {
                  this.username = username.username;
                }
            }
        )
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Incorrect password.';
    }
    return throwError(errorMessage);
  }
}
