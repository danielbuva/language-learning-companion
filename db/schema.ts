import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), language: text('language').notNull(),
  name: text('name').notNull(), settings: text('settings').notNull(), revision: integer('revision').notNull().default(1),
  created: text('created').notNull(), updated: text('updated').notNull(),
}, t => [index('profiles_owner').on(t.owner)]);

export const records = sqliteTable('records', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), profile: text('profile').notNull().references(() => profiles.id, {onDelete:'cascade'}),
  kind: text('kind').notNull(), fingerprint: text('fingerprint').notNull(), payload: text('payload').notNull(),
  revision: integer('revision').notNull().default(1), created: text('created').notNull(), updated: text('updated').notNull(),
}, t => [index('records_scope').on(t.owner,t.profile,t.kind), uniqueIndex('records_dedupe').on(t.owner,t.profile,t.kind,t.fingerprint)]);
