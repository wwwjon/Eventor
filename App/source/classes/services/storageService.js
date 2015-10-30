define(['app/model/event'], function(Event) {
	'use strict';

	var StorageService = function() {
		this.events = [
			new Event(
				'Lunch',
				null,
				'everyone',
				'nothing',
				{
					name: 'Luncheteria',
					street: 'Bahnhofstrasse',
					zipCode: 8640,
					city: 'Rapperswil'
				},
				null,
				{
					begin: new Date('2015-10-10T12:00:00.000Z'),
					end: new Date('2015-10-10T13:00:00.000Z')
				},
				null
			),
			new Event(
				'Dinner',
				null,
				'everyone',
				'nothing',
				{
					name: 'Dinneria',
					street: 'Bahnhofstrasse',
					zipCode: 8000,
					city: 'Zürich'
				},
				null,
				{
					begin: new Date('2015-04-05T18:00:00.000Z'),
					end: new Date('2015-04-05T20:00:00.000Z')
				},
				null
			),
			new Event(
				'Dinner',
				null,
				'everyone',
				'nothing',
				{
					name: 'Dinneria',
					street: 'Wedelweg',
					zipCode: 8640,
					city: 'Rapperswil'
				},
				null,
				{
					begin: new Date('2015-12-08T17:00:00.000Z'),
					end: new Date('2015-12-08T19:00:00.000Z')
				},
				null
			)
		];
	};

	return StorageService;
});

