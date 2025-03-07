'use client';

import { useState, useEffect } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    npm: '',
    prodi: '',
    email: '',
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    audience: '',
  });

  const [operatingHours, setOperatingHours] = useState({ start: 0, end: 0 });
  const [bookedRanges, setBookedRanges] = useState([]);
  const [availableIntervals, setAvailableIntervals] = useState([]);
  const [availableStartTimes, setAvailableStartTimes] = useState([]);
  const [availableEndTimes, setAvailableEndTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fullyBooked, setFullyBooked] = useState(false); // Flag jika semua jam penuh

  // Ambil data ketersediaan saat tanggal & ruangan dipilih
  useEffect(() => {
    if (formData.date && formData.room) {
      fetchAvailability(formData.date, formData.room);
    }
  }, [formData.date, formData.room]);

  async function fetchAvailability(date, room) {
    try {
      setMessage('');
      const res = await fetch(`/api/available-slots?date=${date}&room=${room}`);
      const data = await res.json();
      if (data.success) {
        setOperatingHours(data.operatingHours);
        setBookedRanges(data.bookedRanges);
        setAvailableIntervals(data.availableIntervals);
        
        // Jika tidak ada interval tersedia, tampilkan pesan
        setFullyBooked(data.availableIntervals.length === 0);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }

  // Hasilkan candidate waktu mulai dari availableIntervals
  useEffect(() => {
    const startTimes = [];
    availableIntervals.forEach(interval => {
      for (let hour = interval.start; hour < interval.end; hour++) {
        if (hour < interval.end) {
          startTimes.push(`${hour}:00`);
        }
      }
    });
    startTimes.sort((a, b) => parseInt(a) - parseInt(b));
    setAvailableStartTimes(startTimes);
  }, [availableIntervals]);

  // Hasilkan waktu selesai berdasarkan pilihan waktu mulai
  useEffect(() => {
    if (formData.startTime && availableIntervals.length > 0) {
      const selectedHour = parseInt(formData.startTime.split(':')[0], 10);
      const currentInterval = availableIntervals.find(
        (interval) => selectedHour >= interval.start && selectedHour < interval.end
      );
      if (currentInterval) {
        const endTimes = [];
        for (let hour = selectedHour + 1; hour <= currentInterval.end; hour++) {
          endTimes.push(`${hour}:00`);
        }
        setAvailableEndTimes(endTimes);
      } else {
        setAvailableEndTimes([]);
      }
    } else {
      setAvailableEndTimes([]);
    }
  }, [formData.startTime, availableIntervals]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.startTime || !formData.endTime) {
      setMessage('Pilih waktu mulai dan selesai dengan benar.');
      setLoading(false);
      return;
    }

    const startHour = parseInt(formData.startTime.split(':')[0], 10);
    const endHour = parseInt(formData.endTime.split(':')[0], 10);
    if (endHour <= startHour) {
      setMessage('Waktu selesai harus lebih dari waktu mulai.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        alert('Booking berhasil! Informasi persetujuan akan dikirim via email.');
        window.location.reload(); // Reload halaman setelah booking berhasil
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setMessage('Gagal melakukan booking!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Form Booking Ruangan</h2>
      {message && <p className="text-sm text-center mb-4">{message}</p>}
      
      {fullyBooked ? (
          <div className="text-center">
          <p className="text-red-500 mb-4">
            Semua jam sudah terisi penuh, silakan pilih tanggal lain.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nama" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="npm" placeholder="NPM" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="prodi" placeholder="Prodi" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="purpose" placeholder="Keperluan" required onChange={handleChange} className="w-full p-2 border rounded"></textarea>
          <input type="date" name="date" required onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="room" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Pilih Ruangan</option>
            <option value="Think Tank Room">Think Tank Room</option>
            <option value="Prototyping Room">Prototyping Room</option>
            <option value="Coworking Space">Coworking Space</option>
          </select>

          <select name="startTime" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Pilih Waktu Mulai</option>
            {availableStartTimes.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>

          <select name="endTime" required onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Pilih Waktu Selesai</option>
            {availableEndTimes.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>

          <input type="number" name="audience" placeholder="Banyak Audiens (Max 15)" max="15" required onChange={handleChange} className="w-full p-2 border rounded" />

          <button type="submit" disabled={loading || fullyBooked} className="w-full bg-blue-500 text-white p-2 rounded">
            {loading ? 'Memproses...' : 'Ajukan Booking'}
          </button>
        </form>
      )}
    </div>
  );
}
