"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
async function GET() {
    return new Response(JSON.stringify({
        message: 'Hello World'
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
async function POST(request) {
    const body = await request.json();
    return server_1.NextResponse.json({
        message: 'KPI creado',
        data: body,
    });
}
