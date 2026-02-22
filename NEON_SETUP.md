# Setting Up Neon Database

Follow these steps to set up your Neon PostgreSQL database:

## 1. Access Neon SQL Editor

Go to: https://console.neon.tech/app/projects

Select your project: `ep-silent-moon-aiwjeu1f`

Click on **SQL Editor** in the left sidebar

## 2. Run Schema SQL

1. Copy the entire contents of `neon-schema.sql`
2. Paste into the SQL Editor
3. Click **Run** button
4. You should see "Success" messages for all tables created

## 3. Run Seed Data SQL

1. Copy the entire contents of `neon-seed.sql`
2. Paste into the SQL Editor
3. Click **Run** button
4. You should see 10 products, 3 sliders, and 3 vouchers inserted

## 4. Verify Data

Run this query to check:
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM sliders;
SELECT COUNT(*) FROM vouchers;
```

You should see:
- products: 10
- sliders: 3
- vouchers: 3

## 5. Start the Dev Server

```bash
npm run dev
```

Visit http://localhost:3000 - you should now see products and sliders!

## Troubleshooting

If you get errors about tables already existing, that's fine - the `IF NOT EXISTS` clause will skip them.

If you need to reset the database:
```sql
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF NOT EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS sliders CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
```

Then run the schema and seed files again.
