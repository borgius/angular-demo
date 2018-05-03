import { TestBed } from '@angular/core/testing';
import { asyncData, asyncError } from '../../testing/async-observable-helpers';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TokenStorage } from '../core/token.storage';
import { BookModel } from '../models/book-model';
import { BookService } from './book.service';

const expectedBooks = {
  data: [
    {
      id: 0,
      title: 'title 0',
      author: 'author',
      isbn: '978-1-78862-070-0',
      year: '2016'
    },
    {
      id: 1,
      title: 'title 1',
      author: 'author1',
      isbn: '978-1-78862-070-1',
      year: '2017'
    }
  ]
};

const newBook = {
  id: null,
  title: 'title 2',
  author: 'author 2',
  isbn: '978-1-78862-070-2',
  year: '2018'
};

describe('BookService', () => {
  let service: BookService;
  let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BookService]
    });
    service = new BookService(<any>httpClientSpy);
  });

  it('get books list', () => {
    httpClientSpy.get.and.returnValue(asyncData(expectedBooks));
    service.getBooks().subscribe(books => {
      expect(books).toEqual(expectedBooks, 'expected books');
    });
  });

  it('get book by ID', () => {
    httpClientSpy.get.and.callFake(url =>
      asyncData(expectedBooks.data[url.split('/').slice(-1)])
    );
    service.getBook(1).subscribe(book => {
      expect(book.isbn).toEqual('978-1-78862-070-1', 'expected book');
    });
  });
  it('add book', () => {
    httpClientSpy.post.and.returnValue(asyncData({ ...newBook, id: 3 }));
    service.addBook(newBook).subscribe((book: any) => {
      expect(book.id).toEqual(3);
    });
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/books',
      newBook
    );
  });
});
