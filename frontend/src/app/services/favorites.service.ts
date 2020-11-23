import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class FavoritesService {
	//Because I cant use *ngif on objects I have to create an array of localstorage first to use it.
	//This array is only created for passing it onto favorite book component.
	favoriteItems = [];
	//This is for the dialog component.
	private sendEvent = new Subject<string>();
	sendEventObs = <Observable<string>>this.sendEvent;

	//Once the called function is called the passed parameter is stringifyed and added into the local storage
	addStorage(string) {
		localStorage.setItem(JSON.stringify(`${string.title}, ${string.author}`), JSON.stringify(string.id));
	}

	//This is only used now for the dialog component.
	//The functions that call the dialogs pass the name of the event here and it gets used in a component.
	//It resembles an event emitter sort of
	sendUpdate(string: string) {
		this.sendEvent.next(string);
		if (this.sendEvent.observers.length > 0) this.sendEvent.observers = [];
	}

	//Once this is called it takes the Array declared in this service and fills it with the localstorage items.
	//I only have to do this because the localstorage is returned as an object and I cant use an object as a dataSource.
	getStorage() {
		this.favoriteItems.length = 0;
		for (let i = 0; i < localStorage.length; i++) {
			this.favoriteItems.push(
				localStorage.key(i).replace(/['"]+/g, '').split(',')
			)
		}
		return this.favoriteItems;
	}

	//Once this is called the passed id of the object in the local storage is found and it gets removed from the localstorage.
	removeItem(string: string) {
		let keys = Object.keys(localStorage);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key.includes(string)) {
				localStorage.removeItem(key);
			}
		}
	}
}
