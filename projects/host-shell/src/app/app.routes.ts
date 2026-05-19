import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'remote-azure'
	},
	{
		path: 'remote-azure',
		loadComponent: () =>
			loadRemoteModule('remoteAzure', './Component').then((m) => m.AppComponent)
	},
	{
		path: 'local-micro',
		loadComponent: () =>
			loadRemoteModule('localMicro', './Component').then((m) => m.AppComponent)
	}
];
