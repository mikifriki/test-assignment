import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FavoritesService} from '../../services/favorites.service';

@Component({
	selector: 'app-dialog-overview-example-dialog',
	templateUrl: 'dialog-overview-example-dialog.html',
})
// This component gets used in The Return Book, Delete Book and the Checkout components.
export class DialogOverviewExampleDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private favoritesService: FavoritesService
	) {
	}

	onNoClick() {
		this.dialogRef.close();
	}

	// This sends the input data from the modal window to the observer for it to be used in the checkout proccess.
	confirmClick() {
		this.favoritesService.sendUpdate(`Confirmed,${this.data.firstName},${this.data.lastLame}`);
	}

}

export interface DialogData {
	calledEvent: string;
	firstName?: string;
	lastLame?: string;
}
