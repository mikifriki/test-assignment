import {Component, OnInit} from '@angular/core';
import {FavoritesService} from '../../services/favorites.service';

@Component({
	selector: 'app-favorites-display',
	templateUrl: './favorite-book.display.html',
	styleUrls: ['./favorite-book.display.scss'],
})

export class FavoriteBookDisplay implements OnInit {
	favoriteItems;

	constructor(private favoriteService: FavoritesService) {
	}

	ngOnInit(): void {
		this.favoriteItems = this.favoriteService.getStorage();
	}

	removeItem(string) {
		this.favoriteService.removeItem(string);
		this.ngOnInit();
	}

	clearAllItems() {
		this.favoriteService.clearFavorites();
	}
}
