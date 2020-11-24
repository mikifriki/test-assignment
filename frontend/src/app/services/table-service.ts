import {Injectable} from '@angular/core';
import {Book} from "../models/book";
import {FavoritesService} from "./favorites.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {UtilService} from "./util.service";
import {PageService} from "./page.service";
import {BookService} from "./book.service";
import {CheckoutsService} from "./checkouts.service";


@Injectable()
export class TableService {

	constructor(
		public utilService: UtilService,
		private favoritesService: FavoritesService,
		private pageService: PageService,
		private bookService: BookService,
		private checkoutsService: CheckoutsService
	) {
	}

	dataSource: MatTableDataSource<Book>;
	isDisabled: boolean;
	currentPage: number;
	selection = new SelectionModel<Book>(true, []);
	expandedBook: Book;
	totalPages: number;

	getVariables() {
		return {
			datasource: this.dataSource,
			isDisabled: this.isDisabled,
			selection: this.selection
		}
	}


}
