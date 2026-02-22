const { getSliders } = require('./lib/db/queries');
async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/sliders');
        console.log('Status:', res.status);
        const json = await res.json();
        console.log('Body:', JSON.stringify(json, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
