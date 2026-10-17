import { NextResponse } from 'next/server';

const YOUCAM_API_BASE = 'https://yce-api-01.makeupar.com';

export async function POST(req: Request) {
  try {
    const { personImageUrl, garmentImageUrl, category } = await req.json();

    if (!personImageUrl || !garmentImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing core asset parameters.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PERFECT_CORP_YOUCAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing PERFECT_CORP_YOUCAM_API_KEY in environment' },
        { status: 500 }
      );
    }

    // 1. Create AI Clothes Virtual Try-On Task (v4)
    const createRes = await fetch(`${YOUCAM_API_BASE}/s2s/v2.0/task/cloth-v4`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        src_file_url: personImageUrl,
        ref_file_url: garmentImageUrl,
        garment_category: category || 'upper_body',
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`YouCam Task Creation Failed: ${createRes.status} - ${errorText}`);
    }

    const createData = await createRes.json();
    const taskId = createData?.data?.task_id;
    if (!taskId) {
      throw new Error('No task_id returned from YouCam API');
    }

    // 2. Poll for task completion
    let resultUrl = '';
    const maxAttempts = 25;
    const intervalMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));

      const pollRes = await fetch(`${YOUCAM_API_BASE}/s2s/v2.0/task/cloth-v4/${taskId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const status = pollData?.data?.task_status;

      if (status === 'success') {
        resultUrl = pollData?.data?.results?.url;
        break;
      } else if (status === 'error') {
        throw new Error(pollData?.data?.error?.message || 'YouCam processing failed');
      }
    }

    if (!resultUrl) {
      throw new Error('YouCam try-on processing timed out.');
    }

    return NextResponse.json({ success: true, resultUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
