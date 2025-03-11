import { NextResponse } from 'next/server';
import { getBookingsByDate } from '@/lib/spreadsheet';

export async function GET(request) {
  try {
    // Get the date from the query parameters
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ 
        success: false, 
        message: 'Date parameter is required' 
      }, { status: 400 });
    }
    
    console.log('Fetching bookings for date:', date);
    
    // Get bookings for the specified date
    const bookings = await getBookingsByDate(date);
    
    console.log('Bookings found:', bookings);
    
    return NextResponse.json({ 
      success: true, 
      bookings 
    });
  } catch (error) {
    console.error('Error in schedule API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred while fetching schedule data' 
    }, { status: 500 });
  }
}