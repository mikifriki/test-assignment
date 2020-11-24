import {Injectable} from '@angular/core';

import {Book} from '../models/book';

import {FavoritesService} from './favorites.service';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {UtilService} from './util.service';
import {PageService} from './page.service';
import {BookService} from './book.service';
import {MatPaginator} from '@angular/material/paginator';
import {CheckoutsService} from './checkouts.service';


@Injectable()
export class SelectionService {

	constructor(
		public utilService: UtilService,
		private favoritesService: FavoritesService,
		private pageService: PageService,
		private bookService: BookService,
		private checkoutsService: CheckoutsService
	) {
	}


	// This gets called from both the tables. This returns true if all the rows are selected.
	// This is only called on click on the master checkbox.
	isAllSelected(selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>) {
		const numSelected = selection.selected.length;
		const numRows = dataSource.data.length;
		return numSelected === numRows;
	}

	// This gets called from each of the tables master checkbox.
	// If any of them are selected the masterToggle will deselect them
	// If the none of them are toggled then they all get selected.
	masterToggle(selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>) {
		this.isAllSelected(selection, dataSource) ?
			selection.clear() :
			dataSource.data.forEach(row => selection.select(row));
	}

	// Only BORROWED books can be deleted.
	// This gets called from books-table.
	// It opens a dialog to check if you are sure you want to delete the selected books.
	// This uses the eventObserver in Favorites service.
	// The data sent to remove selected is all the selected books
	removeSelectedRows(
		selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>,
		paginator: MatPaginator, service, eventName: string = 'Delete') {
		this.utilService.openDialog(eventName);
		this.favoritesService.sendEventObs.subscribe((response => {
			if (response) {
				this.pageService.removeSelected(
					selection.selected, dataSource,
					service, paginator
				);
				selection.clear();
			}
		}));
	}


	// This gets the selected books and sends and observedEvent.
	// for each selected book it creates a new CheckedBook object which exists in util.service
	// Then it sends the object for each of the objects to the api.
	// This took a few tries to get right because I kept going through different iterations on how to checkout the book in the best way.
	checkout(selection: SelectionModel<any>) {
		this.utilService.openDialog('Checkout');
		this.favoritesService.sendEventObs.subscribe((response) => {
			if (response) {
				selection.selected.forEach(book => {
					if (book.status === 'AVAILABLE') {
						this.checkoutsService.checkout(this.utilService.checkOutBook(book, response)).subscribe(
							error => {
								console.log(error);
								return;
							}
						);
						book.id.toString().trim();
						this.bookService.saveBook(book).subscribe();
					}
				});
			}
		});
	}

	// This gets the selection and adds each book into localstorage.
	addToFavorites(selection: SelectionModel<any>) {
		selection.selected.forEach(book => {
			this.favoritesService.addStorage(book);
		});

		this.favoritesService.getStorage();
	}

	// This sends api request to change the returned books back to available.
	// It also uses the same "remove selected rows" function to remove the returned books.
	returnBook(
		selection: SelectionModel<any>, dataSource: MatTableDataSource<any>,
		paginator: MatPaginator, service, eventName: string = 'Delete') {
		this.removeSelectedRows(selection, dataSource, paginator, service, eventName);
		selection.selected.forEach(book => {
			book.borrowedBook.status = 'AVAILABLE';
			this.bookService.changeBook(book.borrowedBook.id, book.borrowedBook).subscribe();
		});
	}

}
