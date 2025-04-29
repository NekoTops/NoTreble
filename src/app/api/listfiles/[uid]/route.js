import { NextResponse } from 'next/server';

export async function GET(req) {
  const uid = req.nextUrl.pathname.split('/').pop();

  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://3.14.250.162:443/listfiles/${uid}`);

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching files from EC2:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
