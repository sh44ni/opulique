import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runSchema() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL is not set in .env.local');

    const sql = neon(databaseUrl);

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'neon-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split statements and execute individually since pooled neon endpoints sometimes reject multiple statements
    const statements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`Executing ${statements.length} schema statements...`);

    for (const stmt of statements) {
        try {
            await sql(stmt);
        } catch (e) {
            console.error('Error executing statement:', stmt.substring(0, 50) + '...');
            console.error(e);
        }
    }

    console.log('✅ Schema migration complete!');
}

runSchema().catch(console.error);
