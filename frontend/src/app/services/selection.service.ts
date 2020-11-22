import {Injectable} from '@angular/core';

import {Book} from "../models/book";

import {FavoritesService} from "./favorites.service";

import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {UtilService} from "./util.service";
import {PageService} from "./page.service";
import {BookService} from "./book.service";
import {MatPaginator} from "@angular/material/paginator";
import {CheckoutsService} from "./checkouts.service";


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


	isAllSelected(selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>) {
		const numSelected = selection.selected.length;
		const numRows = dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle(selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>) {
		this.isAllSelected(selection, dataSource) ?
			selection.clear() :
			dataSource.data.forEach(row => selection.select(row));
	}

	removeSelectedRows(selection: SelectionModel<Book>, dataSource: MatTableDataSource<any>, paginator: MatPaginator, service, string: String = "Delete") {
		this.utilService.openDialog(string);
		this.favoritesService.sendEventObs.subscribe((response) => {
			if (response) {
				this.pageService.removeSelected(
					selection.selected, dataSource,
					service, paginator
				);
				selection.clear();
			}
		});
	}

	checkout(selection: SelectionModel<any>) {
		this.utilService.openDialog("Checkout");
		this.favoritesService.sendEventObs.subscribe((response) => {
			if (response) {
				selection.selected.forEach(book => {
					if (book.status == "AVAILABLE") {
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

	addToFavorites(selection: SelectionModel<any>) {
		selection.selected.forEach(book => {
			this.favoritesService.addStorage(book);
		});

		this.favoritesService.getStorage()
	}

	returnBook(selection: SelectionModel<any>, dataSource: MatTableDataSource<any>, paginator: MatPaginator, service, string: String = "Delete") {
		this.removeSelectedRows(selection, dataSource, paginator, service, string);
		selection.selected.forEach(book => {
			book.borrowedBook.status = "AVAILABLE";
			this.bookService.saveBook(book.borrowedBook).subscribe()
		});
	}

}
