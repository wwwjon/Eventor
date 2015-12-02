define(['app/model/event'], function (Event) {
    'use strict';

    var EventFactory = {
        createEventStorage: function() {
            return[ new Event(
                'Walter birthday',
                'The greatest birthday party Walter ever had',
                'Friends of Walter',
                'drinks, cake, salad or snacks',
                {
                    name: 'v house',
                    street: 'Main street 7',
                    zipCode: 8001,
                    city: 'Zurich'
                },
                {
                    begin: new Date('2013-10-10T18:00:00.000Z'),
                    end: new Date('2013-10-11T02:00:00.000Z')
                },
                5,
                null
            ),

			new Event(
				'Peters Feier',
				'The greatest birthday party peter ever had',
				'Friends of Peter',
				'drinks, cake, salad or snacks',
				{
					name: 'Peter house',
					street: 'Main street 3',
					zipCode: 8001,
					city: 'Zurich1'
				},
				{
					begin: new Date('2014-10-10T18:00:00.000Z'),
					end: new Date('2014-10-11T02:00:00.000Z')
				},
				10,
				null
			)];
        }
    };

    return EventFactory;
});
