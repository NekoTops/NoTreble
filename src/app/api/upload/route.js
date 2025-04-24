import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Send same FormData to EC2
    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    const ec2Response = await fetch("http://3.14.250.162:443/upload", {
      method: "POST",
      body: forwardFormData,
    });

    if (!ec2Response.ok) {
      const err = await ec2Response.text();
      return NextResponse.json({ error: err }, { status: ec2Response.status });
    }

    const result = await ec2Response.text(); // Or .json() if EC2 responds with JSON
    return NextResponse.json({ success: true, message: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed", details: String(error) }, { status: 500 });
  }
}
