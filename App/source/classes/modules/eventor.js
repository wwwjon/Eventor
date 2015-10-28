define(['frameworks/angular', 'app/controllers/eventListController', 'app/services/storageService'],
    function (Angular, EventListController, StorageService) {
        'use strict';

        var Eventor = Angular.module('eventor', []);

		Eventor.service('storageService', StorageService);

		EventListController.$inject = ['$scope', 'StorageService'];
		Eventor.controller('EventListController', EventListController);

        return Eventor;
	});