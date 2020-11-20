import {Injectable} from '@angular/core';
import {DialogOverviewExampleDialog} from "../components/button-dialog/dialog-overview-example-dialog";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CheckedBook} from "../models/checked-book";
import {Book} from "../models/book";
import {v4 as uuidv4} from "uuid";
import {FavoritesService} from "./favorites.service";
import {Observable} from "rxjs";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";


@Injectable({
	providedIn: 'root'
})
export class UtilService {

	checkedBook: CheckedBook<Book>;
	dialogRef: MatDialogRef<DialogOverviewExampleDialog>;

	constructor(
		private dialog: MatDialog,
		private favoritesService: FavoritesService
	) {
		this.checkedBook = <CheckedBook<Book>>{};
	}

	//Got this idea from looking at Angular documentation, and finding that mat-paginator has event emitters.
	openDialog(event, firstName?: string, lastName?: string) {
		this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			width: '550px',
			data: {calledEvent: event, firstName: firstName, lastName: lastName}
		});
		this.dialogRef.afterClosed().subscribe();
	}

	checkOutBook(responseBook: Book, eventInput: string) {
		responseBook.status = "BORROWED";
		responseBook.checkOutCount++;
		let dialogInput = this.favoritesService.checkFavorites(eventInput);
		const newCheckedBook: CheckedBook<Book> = {
			id: uuidv4(),
			borrowerFirstName: dialogInput[1],
			borrowerLastName: dialogInput[2],
			borrowedBook: responseBook
		};
		return newCheckedBook;
	}

	filterInput(event: Event, dataSource: MatTableDataSource<Book>) {
		const filterValue = (event.target as HTMLInputElement).value;
		dataSource.filter = filterValue.trim().toLowerCase();
		if (dataSource.paginator) {
			dataSource.paginator.firstPage();
		}
	}
}
