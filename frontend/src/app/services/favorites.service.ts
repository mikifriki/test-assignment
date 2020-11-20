import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class FavoritesService {
	private updateStorage = new Subject<string>();
	private updateState = new Subject<string>();
	updateStorageObs = <Observable<string>>this.updateStorage;
	updateStateObs = <Observable<string>>this.updateState;

	addStorage(string) {
		// @ts-ignore
		localStorage.setItem(JSON.stringify(`${string.title}, ${string.author}`), JSON.stringify(string.id));
	}

	sendUpdateStorage(string) {
		this.updateState.next(string);
	}

	sendUpdate(string) {
		this.updateStorage.next(string);
		if (this.updateStorage.observers.length > 0) this.updateStorage.observers = [];
	}

	allStorage() {
		let values = [];
		for (let i = 0; i < localStorage.length; i++) {
			values.push(
				localStorage.key(i).replace(/['"]+/g, '').split(',')
			)
		}
		return values;
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

	checkFavorites(response) {
		let arr = response.split(",");

		return arr;
	}
}
