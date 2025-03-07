import { NextResponse } from 'next/server';
import { getBookedRanges } from '@/lib/spreadsheet';

function computeAvailableIntervals(operatingHours, bookedRanges) {
  // Pastikan bookedRanges diurutkan berdasarkan start
  const sorted = bookedRanges.sort((a, b) => a.start - b.start);
  const intervals = [];
  let currentStart = operatingHours.start;
  for (const booking of sorted) {
    if (booking.start > currentStart) {
      intervals.push({ start: currentStart, end: booking.start });
    }
    currentStart = Math.max(currentStart, booking.end);
  }
  if (currentStart < operatingHours.end) {
    intervals.push({ start: currentStart, end: operatingHours.end });
  }
  return intervals;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const room = searchParams.get('room');

    if (!date || !room) {
      return NextResponse.json(
        { success: false, message: 'Tanggal dan ruangan diperlukan!' },
        { status: 400 }
      );
    }

    // Jam operasional berdasarkan hari
    const day = new Date(date).toLocaleDateString('id-ID', { weekday: 'long' });
    const OPERATING_HOURS = {
      Senin: { start: 9, end: 16 },
      Selasa: { start: 9, end: 16 },
      Rabu: { start: 9, end: 16 },
      Kamis: { start: 9, end: 16 },
      Jumat: { start: 9, end: 16 },
      Sabtu: { start: 9, end: 12 },
      Minggu: { start: 0, end: 0 },
    };
    const operatingHours = OPERATING_HOURS[day] || { start: 0, end: 0 };

    // Dapatkan booking yang sudah ada untuk tanggal dan ruangan tersebut
    const bookedRanges = await getBookedRanges(date, room);
    // bookedRanges: [{start: 9, end: 13}, ...] misalnya

    // Hitung available intervals
    const availableIntervals = computeAvailableIntervals(operatingHours, bookedRanges);

    return NextResponse.json({
      success: true,
      operatingHours,
      bookedRanges,
      availableIntervals,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan!' },
      { status: 500 }
    );
  }
}
