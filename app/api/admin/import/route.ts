import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
    try {
        console.log('Running CSV import script...');
        const { stdout, stderr } = await execPromise('npx tsx scripts/import-csv.ts longchamp_products_20260210_044856.csv');

        console.log('Script stdout:', stdout);
        if (stderr) console.error('Script stderr:', stderr);

        return NextResponse.json({
            success: true,
            message: 'Import script finished running',
            stdout,
            stderr
        });
    } catch (error) {
        console.error('Error running import script:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to run import script',
            error: String(error)
        }, { status: 500 });
    }
}
