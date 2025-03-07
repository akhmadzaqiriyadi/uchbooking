// src/lib/spreadsheet.js
import { google } from 'googleapis';

// Konfigurasi Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = 'BookingData';

// Fungsi untuk menambahkan booking dengan range waktu dan durasi
export async function addBooking(bookingData) {
    try {
      // Misal bookingData.startTime = "10:00" dan bookingData.endTime = "12:00"
      const startHour = parseInt(bookingData.startTime.split(':')[0], 10);
      const endHour = parseInt(bookingData.endTime.split(':')[0], 10);
      const duration = endHour - startHour;
      const timeRange = `${bookingData.startTime} - ${bookingData.endTime}`;
  
      const values = [
        [
          bookingData.date,       // Hari/Tanggal
          timeRange,              // Jam Peminjaman (rentang waktu)
          duration,               // Durasi Pinjam (dalam jam)
          bookingData.name,
          bookingData.prodi,
          bookingData.npm,
          bookingData.purpose,
          bookingData.room,
          bookingData.audience,
          '',                     // PIC Ruangan (opsional)
          bookingData.email,
          'Pending'               // Kolom Perizinan
        ],
      ];
  
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:L`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values },
      });
  
      return { success: true, message: 'Booking berhasil dikirim!' };
    } catch (error) {
      console.error('Error adding booking:', error);
      return { success: false, message: 'Gagal mengirim booking.' };
    }
  }

// Tambahkan fungsi baru di src/lib/spreadsheet.js
export async function getBookedRanges(date, room) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });
  
    const rows = response.data.values || [];
    const bookedRanges = rows
      .filter(row => row[0] === date && row[7] === room)
      .map(row => {
        // row[1] berformat "10:00 - 12:00"
        const times = row[1].split(' - ');
        const start = parseInt(times[0].split(':')[0], 10);
        const end = parseInt(times[1].split(':')[0], 10);
        return { start, end };
      });
    return bookedRanges;
  }
  