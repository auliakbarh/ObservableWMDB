import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const requestSchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'requests',
      columns: [
        {name: 'createdAt', type: 'number'},
        {name: 'judulRequest', type: 'string'},
        {name: 'tipeRequest', type: 'string'},
        {name: 'alasan', type: 'string'},
        {name: 'updatedAt', type: 'number'}
      ],
    }),
    tableSchema({
      name: 'hazards',
      columns: [
        {name: 'createdAt', type: 'number', isOptional: true},
        {name: '_id', type: 'string', isOptional: true},
        {name: 'waktuLaporan', type: 'number'},
        {name: 'judulHazard', type: 'string'},
        {name: 'detailLaporan', type: 'string'},
        {name: 'lokasi', type: 'string'},
        {name: 'subLokasi', type: 'string'},
        {name: 'detailLokasi', type: 'string'},
      ],
    }),
  ],
});

