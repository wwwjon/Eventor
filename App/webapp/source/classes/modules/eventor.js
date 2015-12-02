
// declare dependency to angular (similar to import in java)
define(['frameworks/angular', 'app/controllers/event/listController', 'app/controllers/event/detailController', 'app/controllers/event/addController', 'app/controllers/event/editController', 'app/controllers/guest/addController', 'app/controllers/guest/editController','app/repository/EventRepository','app/repository/GuestRepository', 'libraries/angularRoute'],
    function (Angular, EventListController, EventDetailController, EventAddController, EventEditController, GuestAddController, GuestEditController, EventRepository, GuestRepository) {
    'use strict';

	var Eventor = Angular.module('eventor', ['ngRoute']);

    EventRepository.$inject = ['$http'];
    Eventor.service('EventRepository', EventRepository);

    GuestRepository.$inject = ['$http'];
    Eventor.service('GuestRepository', GuestRepository);

	EventListController.$inject = ['$scope', 'EventRepository'];
	Eventor.controller('EventListController', EventListController);

    EventDetailController.$inject = ['$scope', '$location', '$routeParams', 'EventRepository', 'GuestRepository'];
    Eventor.controller('EventDetailController', EventDetailController);

	EventAddController.$inject = ['$scope', '$location', 'EventRepository'];
	Eventor.controller('EventAddController', EventAddController);

	EventEditController.$inject = ['$scope', '$location', '$routeParams', 'EventRepository'];
	Eventor.controller('EventEditController', EventEditController);

    GuestAddController.$inject = ['$scope', '$location', '$routeParams', 'GuestRepository'];
    Eventor.controller('GuestAddController', GuestAddController);

    GuestEditController.$inject = ['$scope', '$location', '$routeParams', 'GuestRepository'];
    Eventor.controller('GuestEditController', GuestEditController);

    Eventor.config(function($routeProvider) {
        $routeProvider.when('/list', {
            controller: 'EventListController',
            templateUrl: './views/event/list.html'
        })
        .when('/events/:eventId/guests/new', {
            controller: 'GuestAddController',
            templateUrl: './views/guest/edit.html'
        })
        .when('/events/:eventId/guests/:guestId/edit', {
            controller: 'GuestEditController',
            templateUrl: './views/guest/edit.html'
        })
		.when('/events/new', {
			controller: 'EventAddController',
			templateUrl: './views/event/edit.html'
		})
		.when('/events/:eventId/edit', {
			controller: 'EventEditController',
			templateUrl: './views/event/edit.html'
		})
        .when('/events/:eventId', {
            controller: 'EventDetailController',
            templateUrl: './views/event/detail.html'
        })
        .otherwise({
            redirectTo: '/list'
        });
    });

	return Eventor;
});
