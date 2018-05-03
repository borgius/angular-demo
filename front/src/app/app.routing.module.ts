import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { BookDialogComponent } from './book/book-dialog.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'books',
    children: [
      { path: '', component: BookComponent },
      { path: 'add', component: BookDialogComponent },
      { path: ':id', component: BookDialogComponent },
      { path: ':id/delete', component: BookDialogComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
