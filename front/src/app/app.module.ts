import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { CustomMaterialModule } from './core/material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
// import { LoginService } from './services/login.service';
import { AuthService } from './services/auth.service';
import { BookService } from './services/book.service';
import { Interceptor } from './core/inteceptor';
import { TokenStorage } from './core/token.storage';

import { LoginComponent } from './login/login.component';
import { BookComponent } from './book/book.component';
import { BookDialogComponent } from './book/book-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    LoginComponent,
    BookDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    BookService,
    TokenStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
