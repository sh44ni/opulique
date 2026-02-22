async function verify() {
    const baseUrl = 'http://localhost:3000';

    console.log('Verifying security fixes...\n');

    // 1. Check Admin Page Protection (Middleware)
    try {
        const res = await fetch(`${baseUrl}/admin/dashboard`, {
            redirect: 'manual' // Don't follow redirects automatically
        });
        console.log(`[Middleware] GET /admin/dashboard - Status: ${res.status}`);

        if (res.status === 307 || res.status === 308 || res.status === 302) {
            const location = res.headers.get('location');
            if (location?.includes('/admin/login')) {
                console.log('✅ PASS: Redirects to login');
            } else {
                console.log(`❌ FAIL: Redirects to ${location}`);
            }
        } else if (res.status === 200) {
            // Check if it's the login page content (sometimes middleware rewrites instead of redirecting?)
            // But my middleware implementation uses NextResponse.redirect
            console.log('❌ FAIL: Returned 200 OK (Access Granted)');
        } else {
            console.log(`❓ WARN: Unexpected status ${res.status}`);
        }

    } catch (e) {
        console.error('❌ FAIL: Could not connect to server', e);
    }

    // 2. Check API Route Protection (requireAuth)
    const apiRoutes = [
        '/api/admin/products',
        '/api/admin/orders',
        '/api/admin/customers',
        '/api/admin/vouchers',
        '/api/admin/sliders',
        '/api/admin/reviews',
        '/api/admin/stats'
    ];

    for (const route of apiRoutes) {
        try {
            const res = await fetch(`${baseUrl}${route}`);
            console.log(`[API] GET ${route} - Status: ${res.status}`);

            if (res.status === 401) {
                console.log('✅ PASS: 401 Unauthorized');
            } else {
                // Try to read body to see error
                const text = await res.text();
                console.log(`❌ FAIL: Status ${res.status}`);
                console.log(`   Response: ${text.substring(0, 100)}...`);
            }
        } catch (e) {
            console.error(`❌ FAIL: Error calling ${route}`, e);
        }
    }
}

verify();
