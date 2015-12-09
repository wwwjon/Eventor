define(['app/model/event'], function (Event) {
    'use strict';

    var EventFactory = {
        createEvent: function(identifier) {
            return new Event(
                'Simons birthday',
                'The greatest birthday party simon ever had',
                'Friends of Simon',
                'drinks, cake, salad or snacks',
                {
                    name: 'Simons house',
                    street: 'Main street 5',
                    zipCode: 8000,
                    city: 'Zurich'
                },
                {
                    begin: new Date('2015-10-10T18:00:00.000Z'),
                    end: new Date('2015-10-11T02:00:00.000Z')
                },
                10,
                identifier
            );
        }
    };

    return EventFactory;
});
