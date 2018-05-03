import { BookModel } from '../models/book-model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BookService {
  constructor(private http: HttpClient) {}

  private userUrl = 'http://localhost:8080/api/books';

  public getBooks(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  public getBook(id): Observable<any> {
    return this.http.get(`${this.userUrl}/${id}`);
  }

  public deleteBook(id): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }

  public updateBook(book: BookModel) {
    return this.http.put(`${this.userUrl}/${book.id}`, book);
  }

  public addBook(book: BookModel) {
    return this.http.post(this.userUrl, book);
  }
}
