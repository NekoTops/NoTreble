// /app/api/convert/route.js (for Next.js 13+)
import { NextResponse } from "next/server";

export async function POST(req) {
  const { uid, filename } = await req.json();

  // Perform the conversion logic here
  try {
    // Forward the conversion request to EC2
    const convertResponse = await fetch("http://3.14.250.162:443/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        filename: filename,
      }),
    });

    if (!convertResponse.ok) {
      const errText = await convertResponse.text();
      return NextResponse.json({ error: errText }, { status: convertResponse.status });
    }

    const result = await convertResponse.text(); // Or .json() if EC2 returns JSON
    return NextResponse.json({ success: true, message: result });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Conversion failed", details: String(error) }, { status: 500 });
  }
}
