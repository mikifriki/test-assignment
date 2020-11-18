import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
	selector: 'app-books-list',
	templateUrl: './books-list.component.html',
	styleUrls: ['./books-list.component.scss']
})

export class BooksListComponent implements OnInit {
	books$: Observable<Page<Book>>;
	currentBooks: Page<Book>;
	displayedColumns: string[] = ['title', 'author'];
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	log(val) {
		console.log(val);
	}

	constructor(
		private bookService: BookService,
	) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.books$ = this.bookService.getBooks({pageIndex: 1});
		this.books$.subscribe(
			books => {
				this.currentBooks = books;
				this.dataSource = new MatTableDataSource(books.content);
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
			},
			err => console.log('HTTP Error', err)
		);
	}

	filterInput(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}

	onClick() {
		this.bookService.getBooks({pageSize: this.currentBooks.totalElements}).subscribe(
			countries => {
				this.dataSource = new MatTableDataSource(countries.content);
				this.dataSource.paginator = this.paginator;
				this.isDisabled = true;
			},
			err => console.log('HTTP Error', err)
		);
	}
}
