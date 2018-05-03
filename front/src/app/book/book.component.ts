import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { BookService } from '../services/book.service';

@Component({
  selector: 'app-root',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  displayedColumns = ['id', 'title', 'author', 'isbn', 'year', 'actions'];
  dataSource = new MatTableDataSource();
  constructor(private router: Router, private service: BookService) {}
  ngOnInit(): void {
    this.service.getBooks().subscribe(data => {
      this.dataSource.data = data.data;
    });
  }
}
