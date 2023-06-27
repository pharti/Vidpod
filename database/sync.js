import { synchronize } from '@nozbe/watermelondb/sync';
import SyncLogger from '@nozbe/watermelondb/sync/SyncLogger';
import { useDispatch } from 'react-redux';
import { setSyncing } from '../features/generalSlice';
// const logger = new SyncLogger(10 /* limit of sync logs to keep in memory */);

export async function mySync(database, user_id) {
  const dispatch = useDispatch();
  dispatch(setSyncing(true));
  // if (user_id) {
  await synchronize({
    database,
    // log: logger.newLog(),
    // unsafeTurbo: true,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const urlParams = `date=${
        lastPulledAt ? lastPulledAt : 0
      }&schema_version=${schemaVersion}&migration=${encodeURIComponent(
        JSON.stringify(migration),
      )}&d=${new Date().getTime()}&user_id=${user_id}`;
      const response = await fetch(
        `https://yidpod.com/wp-json/yidpod/v1/new-episodesv2?${urlParams}`,
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      // const json = await response.text();
      // return { syncJson: json };
      const { changes, timestamp } = await response.json();
      // const updated = changes.updated;
      // for (i = 0; i < updated.length; i++) {
      //   u = updated[i];
      //   u.published_date = parseInt(updated[i].published_date);
      //   u.e_index = parseInt(updated[i].e_index);
      //   console.log(u);
      // }
      // logger.log(changes, timestamp);
      return { changes, timestamp: parseInt(timestamp) };
    },
    // pushChanges: async ({ changes, lastPulledAt }) => {
    //   const response = await fetch(
    //     `https://yidpod.com/wp-json/yidpod/v1/sync?type=podcasts&last_pulled_at=${lastPulledAt}`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify(changes),
    //     },
    //   );
    //   if (!response.ok) {
    //     throw new Error(await response.text());
    //   }
    // },
    sendCreatedAsUpdated: true,
    migrationsEnabledAtVersion: 1,
  });
  // }
  dispatch(setSyncing(false));
}
