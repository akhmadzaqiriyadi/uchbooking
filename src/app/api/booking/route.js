import { NextResponse } from 'next/server';
import { addBooking, getAvailableSlots } from '@/lib/spreadsheet';

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi input
    if (!body.name || !body.npm || !body.email || !body.date || !body.startTime || !body.room) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap!' }, { status: 400 });
    }

    // Simpan ke Google Spreadsheet
    const result = await addBooking(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan!' }, { status: 500 });
  }
}
