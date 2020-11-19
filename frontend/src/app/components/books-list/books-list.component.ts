import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {FavoritesService} from '../../services/favorites.service';
import {Observable} from 'rxjs';
import {Page} from '../../models/page';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
	selector: 'app-books-list',
	templateUrl: './books-list.component.html',
	styleUrls: ['./books-list.component.scss']
})

export class BooksListComponent implements OnInit {
	books$: Observable<Page<Book>>;
	displayedColumns: string[] = ['select', 'title', 'author', 'genre', 'status', 'year'];
	currentBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;

	checkedData = [];
	selection = new SelectionModel<Book>(true, []);
	checkedDataSource = new MatTableDataSource<Book>(this.checkedData);
	checkedSelection = new SelectionModel<Book>(true, []);

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private bookService: BookService, private favoritesService: FavoritesService) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.books$ = this.bookService.getBooks({pageIndex: this.currentPage, pageSize: 50});
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

	// Is gotten from Angulars own Table select website
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	//Till here
	removeSelectedRows() {
		this.selection.selected.forEach(book => {
			let elementPos = this.dataSource.data.map((x) => {
				return x.id;
			}).indexOf(book.id);
			this.bookService.deleteBook(book.id).subscribe(data => {
					this.dataSource.data.splice(elementPos, 1);
					this.dataSource.paginator = this.paginator
				},
				error => error);
		})
	}

	addToFavorites() {
		this.selection.selected.forEach(book => {
			this.favoritesService.sendUpdate(`${book.id}`);
			this.favoritesService.addStorage(book);
		})
	}
}
