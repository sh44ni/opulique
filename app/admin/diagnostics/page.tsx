import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import {
    reviews, users, products, orders, customers,
    settings, vouchers, sliders, banners, messages, admin_users
} from '@/lib/db/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Database, Server } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getTableStats() {
    const tables = [
        { name: 'reviews', table: reviews },
        { name: 'users', table: users },
        { name: 'products', table: products },
        { name: 'orders', table: orders },
        { name: 'customers', table: customers },
        { name: 'settings', table: settings },
        { name: 'vouchers', table: vouchers },
        { name: 'sliders', table: sliders },
        { name: 'banners', table: banners },
        { name: 'messages', table: messages },
        { name: 'admin_users', table: admin_users },
    ];

    const stats = [];
    let dbStatus = 'connected';
    let dbError = null;

    try {
        // Test connection
        await db.execute(sql`SELECT 1`);

        for (const t of tables) {
            try {
                const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(t.table);
                stats.push({ name: t.name, count: Number(count), status: 'ok' });
            } catch (error: any) {
                stats.push({ name: t.name, count: 0, status: 'error', error: error.message });
            }
        }
    } catch (error: any) {
        dbStatus = 'disconnected';
        dbError = error.message;
    }

    return { stats, dbStatus, dbError };
}

export default async function DiagnosticsPage() {
    const { stats, dbStatus, dbError } = await getTableStats();

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">System Diagnostics</h1>
                <p className="text-muted-foreground">Monitor database health and table integrity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {dbStatus === 'connected' ? (
                                <>
                                    <span className="text-green-600">Connected</span>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </>
                            ) : (
                                <>
                                    <span className="text-red-600">Error</span>
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {dbError || 'Connection successful'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.length}</div>
                        <p className="text-xs text-muted-foreground">Monitored entities</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Table Integrity Check</CardTitle>
                    <CardDescription>Row counts and connectivity status for all registered tables.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Table Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Row Count</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((stat) => (
                                <TableRow key={stat.name}>
                                    <TableCell className="font-medium font-mono">{stat.name}</TableCell>
                                    <TableCell>
                                        {stat.status === 'ok' ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive">Error</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{stat.count}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {stat.error ? (
                                            <span className="text-red-500 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                {stat.error}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="h-3 w-3" /> Verified
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
