import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { uid, filename } = params;

    const res = await fetch(`http://3.14.250.162:443/getxml/${uid}/${filename}`);
    const xml = await res.text();

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
