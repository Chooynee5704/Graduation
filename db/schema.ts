import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const attendance=sqliteTable('attendance',{
  id:text('id').primaryKey(),
  name:text('name').notNull(),
  createdAt:integer('created_at').notNull(),
});
