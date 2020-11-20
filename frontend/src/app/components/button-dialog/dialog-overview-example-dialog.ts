import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FavoritesService} from "../../services/favorites.service";

@Component({
	selector: 'dialog-overview-example-dialog',
	templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
	constructor(
		public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private favoritesService: FavoritesService
	) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	confimClick() {
		this.favoritesService.sendUpdate(`Confirmed,${this.data.firstName},${this.data.lastLame}`);
	}

}

export interface DialogData {
	calledEvent: string,
	firstName?: string,
	lastLame?: string
}
