
// declare dependency to angular (similar to import in java)
define(['frameworks/angular', 'app/controllers/eventListController','app/services/storageService'], function (Angular, EventListController, StorageService) {

	var Eventor = Angular.module('eventor', []);

	Eventor.service('StorageService', StorageService);
	EventListController.$inject = ['$scope', 'StorageService'];
	Eventor.controller('EventListController', EventListController);

	//EventListController.$inject = ['$scope'];

	return Eventor;
});