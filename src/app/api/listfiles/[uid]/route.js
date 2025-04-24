// app/api/listfiles/[uid]/route.js
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { uid } = params; // Extract the UID from the dynamic route

  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  try {
    // Send the UID to the EC2 server to fetch the file list
    const response = await fetch(`http://3.14.250.162:443/listfiles/${uid}`);

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    const data = await response.json();

    // Return the files as JSON to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching files from EC2:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
