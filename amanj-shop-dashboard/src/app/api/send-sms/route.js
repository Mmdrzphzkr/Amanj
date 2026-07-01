// app/api/send-sms/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request) {  // ✅ تصحیح نام پارامتر
  try {
    const body = await request.json();
    const { name, lastname, phone, services, description } = body;

    // شماره‌هایی که باید اس‌ام‌اس بهشون ارسال بشه
    const adminPhones = [
      '09005739084',
      '09928203497',
    ];

    // اطلاعات پنل فرازاس‌ام‌اس از env
    const from = process.env.FARAZSMS_FROM;
    const patternCode = process.env.FARAZSMS_PATTERN_CODE;
    const apiKey = process.env.FARAZSMS_APIKEY

    // تبدیل لیست سرویس‌ها به رشته
    const servicesText = services?.map((s) => s.name).join('، ') || 'بدون سرویس';
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Api-Key", apiKey);
    myHeaders.append("Content-Type", "application/json");
    // ارسال اس‌ام‌اس به همه شماره‌های مدیران با پترن
    const sendPromises = adminPhones.map(async (adminPhone) => {
      const response = await fetch('https://api.iranpayamak.com/ws/v1/sms/pattern', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          code: patternCode,
          recipient: adminPhone,
          line_number: from,
          attributes: {
            name: name,
            lastname: lastname,
            phone: phone,
            services: servicesText,
          },
          number_format: 'english'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });

    const results = await Promise.all(sendPromises);

    const allSuccess = results.every((r) => r.success === true);

    if (!allSuccess) {
      console.error('Some SMS failed:', results);
    }

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      results: results,
    });

  } catch (error) {
    console.error('SMS Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'درخواست ثبت شد اما ارسال پیامک با مشکل مواجه شد',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    );
  }
}