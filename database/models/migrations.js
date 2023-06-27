import {
  schemaMigrations,
  addColumns,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    // We'll add migration definitions here later
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 2,
      steps: [
        // See "Migrations API" for more details
        addColumns({
          table: 'podcasts',
          columns: [{ name: 'play_date', type: 'number' }],
        }),
      ],
    },
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 3,
      steps: [
        // See "Migrations API" for more details
        addColumns({
          table: 'podcasts',
          columns: [{ name: 'notify', type: 'boolean' }],
        }),
      ],
    },
  ],
});
