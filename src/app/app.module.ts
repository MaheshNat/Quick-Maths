import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ArithmeticComponent } from './arithmetic/arithmetic.component';
import { PowersComponent } from './powers/powers.component';
import { NumberSenseComponent } from './number-sense/number-sense.component';
import { AboutComponent } from './about/about.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';
import { TestEndComponent } from './test-end/test-end.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderboardComponent } from './leaderboard/leaderboard/leaderboard.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import {
  AngularFirestore,
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  MatButtonModule,
  MatButton,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'arithmetic', component: ArithmeticComponent },
  { path: 'powers', component: PowersComponent },
  { path: 'number-sense', component: NumberSenseComponent },
  { path: 'about', component: AboutComponent },
  { path: 'test', component: TestComponent },
  { path: 'test-end', component: TestEndComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'leaderboard/:test', component: LeaderboardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ArithmeticComponent,
    PowersComponent,
    NumberSenseComponent,
    AboutComponent,
    HomeComponent,
    TestComponent,
    TestEndComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    LeaderboardComponent,
    MainNavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
