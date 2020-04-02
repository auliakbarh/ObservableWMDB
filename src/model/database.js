import Request from './Request'
import Hazard from './Hazard'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { requestSchema } from './schema'

const adapter = new SQLiteAdapter({
    dbName: 'WatermelonDBTest',
    schema: requestSchema,
})

const database = new Database({
    // ...
    adapter,
    modelClasses: [Request, Hazard],
    actionsEnabled: true, 
})

export default database;