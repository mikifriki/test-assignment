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
import {CheckoutsService} from "../../services/checkouts.service";
import {CheckedBook} from "../../models/checked-book";
import {v4 as uuidv4} from 'uuid';
import {PageService} from "../../services/page.service";
import {DialogOverviewExampleDialog} from "../button-dialog/dialog-overview-example-dialog";
import {MatDialog} from "@angular/material/dialog";

@Component({
	selector: 'app-books-list',
	templateUrl: './books-table.component.html',
	styleUrls: ['./books-table.component.scss']
})

export class BooksTableComponent implements OnInit {
	books$: Observable<Page<Book>>;
	displayedColumns: string[] = ['select', 'title', 'author', 'genre', 'status', 'year'];
	currentBooks: Page<Book>;
	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	checkedBook: CheckedBook;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	animal: string;
	event: string;


	constructor(public dialog: MatDialog,
				private pageService: PageService,
				private checkoutsService: CheckoutsService,
				private bookService: BookService,
				private favoritesService: FavoritesService) {
	}

	ngOnInit(): void {
		this.isDisabled = false;
		this.currentPage = 0;
		this.checkedBook = <CheckedBook>{};
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

	Checkout() {
		this.event = "Checkout these books";
		this.openDialog();
		this.favoritesService.updateStorageObs.subscribe((response) => {
			if (response) {
				this.selection.selected.forEach(book => {
					if (book.status == "AVAILABLE") {
						book.status = "BORROWED";
						book.checkOutCount++;
						this.checkedBook.id = uuidv4();
						this.checkedBook.borrowedBook = book;
						this.checkoutsService.checkout(this.checkedBook).subscribe();
						this.bookService.saveBook(book).subscribe();
					}
				});
			}
		});
	}

	//Moved this into its own service so there would'nt be repeating code
	handlePage(event: any) {
		this.pageService.handlePage(
			this.dataSource, event,
			this.currentBooks, this.currentPage,
			this.checkoutsService.getCheckouts({pageIndex: this.currentPage, pageSize: 50}),
			this.paginator
		);
	}

	// Is gotten from Angular's own Table select website
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
	removeSelectedRows(): void {
		this.event = "Delete";
		this.openDialog();
		this.favoritesService.updateStorageObs.subscribe((response) => {
			if (response) {
				this.pageService.removeSelected(
					this.selection.selected, this.dataSource,
					this.bookService, this.paginator
				);
				this.selection.clear();
			}
		})


	}

	addToFavorites() {
		this.selection.selected.forEach(book => {
			this.favoritesService.sendUpdate(`${book.id}`);
			this.favoritesService.addStorage(book);
		})
	}

	openDialog(): void {
		this.dialog.open(DialogOverviewExampleDialog, {
			width: '250px',
			data: {calledEvent: this.event, animal: this.animal}
		});
	}
}
