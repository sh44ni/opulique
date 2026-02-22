const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');
const { neonConfig } = require('@neondatabase/serverless');

neonConfig.webSocketConstructor = ws;

const connectionString = "postgresql://neondb_owner:npg_p9y6atuhGXIT@ep-silent-moon-aiwjeu1f.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString });

async function testConnection() {
    try {
        console.log('🔌 Testing connection to Neon...');
        console.log('📝 Connection string:', connectionString);

        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful!');
        console.log('⏰ Server time:', result.rows[0].now);

        const productsResult = await pool.query('SELECT COUNT(*) FROM products');
        console.log('📦 Products in database:', productsResult.rows[0].count);

        const slidersResult = await pool.query('SELECT COUNT(*) FROM sliders');
        console.log('🎨 Sliders in database:', slidersResult.rows[0].count);

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection();
