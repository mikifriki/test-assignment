import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FavoritesService} from '../../services/favorites.service';
@Component({
	selector: 'app-favorites-display',
	templateUrl: './favorite-book.display.html',
	styleUrls: ['./favorite-book.display.scss'],
})

export class FavoriteBookDisplay implements OnInit {
	favoriteItems: string[];

	constructor(private favoriteService: FavoritesService) {
		this.favoriteService.updateStorageObs.subscribe((response) => {
			if (response) {
				this.favoriteService.allStorage();
				this.ngOnInit();
			}

		})
	}

	ngOnInit(): void {
		this.favoriteItems = this.favoriteService.allStorage();
	}

	removeItem(string) {
		this.favoriteService.removeItem(string);
		this.ngOnInit();
	}
}
