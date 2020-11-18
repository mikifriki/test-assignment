import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {CheckoutsService} from '../../services/checkouts.service';
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

	displayedColumns: string[] = ['title', 'author', 'genre', 'status', 'year'];

	currentBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	log(val) {
		console.log(val);
	}

	constructor(private bookService: BookService, private checkoutsService: CheckoutsService) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.books$ = this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50});
		this.checkoutsService.getCheckouts({}).subscribe(checkout => console.log(checkout));
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
				this.dataSource.sort = this.sort;
				this.isDisabled = true;
			},
			err => console.log('HTTP Error', err)
		);
	}

	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	handlePage(event: any) {
		if (this.dataSource.data.length == this.currentBooks.totalElements) return;
		if (event.previousPageIndex < event.pageIndex || event.pageSize === event.length) {
			this.currentPage++;
			this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50}).subscribe(
				countries => {
					this.dataSource.data.push(...countries.content);
					this.dataSource.paginator = this.paginator;
				},
				err => console.log('HTTP Error', err)
			);
		} else {
		}
	}
}
