define([], function() {
	'use strict';

	var Event = function(name, description, targetGroup, eventGift, location, preparation, event, maximalAmoutOfGuests) {
		this.name = name;
		this.description = description;
		this.targetGroup = targetGroup;
		this.eventGift = eventGift;
		this.location = location;
		this.preparation = preparation;
		this.event = event;
		this.maximalAmoutOfGuests = maximalAmoutOfGuests;

		Object.defineProperty(this, 'begin', {
			get: function() {
				return this.event.begin;
			},
			set: function(begin) {
				this.event.begin = begin;
			}
		});

		Object.defineProperty(this, 'end', {
			get: function() {
				return this.event.end;
			},
			set: function(end) {
				this.event.end = end;
			}
		});

		Object.defineProperty(this, 'preparationBegin', {
			get: function() {
				return this.preparation.begin;
			},
			set: function(begin) {
				this.event.preparation = begin;
			}
		});

		Object.defineProperty(this, 'preparationEnd', {
			get: function() {
				return this.preparation.end;
			},
			set: function(end) {
				this.preparation.end = end;
			}
		});
	};

	return Event;
});
