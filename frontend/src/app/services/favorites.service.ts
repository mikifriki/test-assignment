import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class FavoritesService {
	//Because I cant use *ngif on objects I have to create an array of localstorage first to use it.
	favoriteItems = [];
	private sendEvent = new Subject<string>();
	//This array is only created for passing it onto favorite book component.
	sendEventObs = <Observable<string>>this.sendEvent;

	addStorage(string) {
		localStorage.setItem(JSON.stringify(`${string.title}, ${string.author}`), JSON.stringify(string.id));
	}

	sendUpdate(string) {
		this.sendEvent.next(string);
		if (this.sendEvent.observers.length > 0) this.sendEvent.observers = [];
	}

	getStorage() {
		this.favoriteItems.length = 0;
		for (let i = 0; i < localStorage.length; i++) {
			this.favoriteItems.push(
				localStorage.key(i).replace(/['"]+/g, '').split(',')
			)
		}
		return this.favoriteItems;
	}

	removeItem(string) {
		let keys = Object.keys(localStorage);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key.includes(string)) {
				localStorage.removeItem(key);
			}
		}
	}

	clearFavorites() {
		localStorage.clear();
		this.favoriteItems.length = 0;
	}

	checkFavorites(response) {
		let arr = response.split(",");
		return arr;
	}
}
