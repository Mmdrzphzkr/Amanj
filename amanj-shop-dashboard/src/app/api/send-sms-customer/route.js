// app/api/send-sms-customer/route.ts
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, lastname, phone, services } = body;

    // اطلاعات پنل فرازاس‌ام‌اس از env
    const lineNumber = process.env.FARAZSMS_FROM;
    const customerPatternCode = process.env.FARAZSMS_PATTERN_CODE_CUSTOMER;
    const apiKey = process.env.FARAZSMS_APIKEY

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Api-Key", apiKey);
    myHeaders.append("Content-Type", "application/json");

    // ارسال پیام تایید به مشتری
    const response = await fetch('https://api.iranpayamak.com/ws/v1/sms/pattern', {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        code: customerPatternCode,
        line_number: lineNumber,
        recipient: phone,
        attributes: {
          name: name,
          lastname: lastname,
        },
        number_format: 'english'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Customer SMS sent successfully',
      result: result,
    });

  } catch (error) {
    console.error('Customer SMS Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send customer SMS' },
      { status: 500 }
    );
  }
}