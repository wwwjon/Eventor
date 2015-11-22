define(['app/services/uuidService'], function(UUIDService) {
    'use strict';

    var Event = function(name, description, targetGroup, contributionsDescription, location, times, maximalAmountOfGuests, id, guests) {
        this.id = id || UUIDService.getRandomUuid();
        this.name = name;
        this.description = description;
        this.targetGroup = targetGroup;
        this.contributionsDescription = contributionsDescription;
        this.location = location;
        this.times = times;
        this.maximalAmountOfGuests = maximalAmountOfGuests;
        this.guests = guests;

        Object.defineProperty(this, 'begin', {
            get: function() {
                return this.times.begin;
            },
            set: function(begin) {
                this.times.begin = begin;
            }
        });

        Object.defineProperty(this, 'end', {
            get: function() {
                return this.times.end;
            },
            set: function(end) {
                this.times.end = end;
            }
        });
    };

    Event.createDTO = function(jsonData) {
        return new Event(
            jsonData.name,
            jsonData.description,
            jsonData.targetGroup,
            jsonData.contributionsDescription,
            jsonData.location,
            jsonData.times,
            jsonData.maximalAmountOfGuests,
            jsonData.id,
            jsonData.guests
        );
    };


    return Event;
});
