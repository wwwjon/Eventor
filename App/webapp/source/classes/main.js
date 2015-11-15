require.config({
	// base url relative to the index.html
	baseUrl: './',
	paths: {
        'frameworks/angular': 'frameworks/angular/angular.min',
        'libraries/angularRoute': 'libraries/angular/angular-route',
        'app': 'classes'
	},

	// angular does not support async loading out of the box -> use the shim loader
	shim: {
		'frameworks/angular': {
			exports: 'angular'
		},
        'libraries/angularRoute': {
            deps: ['frameworks/angular']
        }
	}
});



require(['frameworks/angular', 'app/modules/eventor'], function (Angular, Eventor) {
	Angular.element(document).ready(function(){
		Angular.bootstrap(document,[Eventor.name]);
	})
});