// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Modal from '@/components/Modal';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchReports = async () => {
    const { data, error } = await supabase.from('RecruiterList').select('*').order('created_at', { ascending: false });
    if (!error) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report =>
    Object.values(report).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <main className="p-6 font-sans text-gray-800 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-700 mb-4">🚨 Recruiter Watch</h1>
        <p className="text-gray-600 text-lg">Browse reported recruiters or submit a new one</p>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
          <a href="https://buymeacoffee.com/supportdev" target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">Support</a>
        </div>
      </div>

      <div className="mb-6">
        <input
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search recruiters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-auto border rounded-lg shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Company</th>
              <th className="p-3">Extra Details</th>
              <th className="p-3">Reported</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r, i) => (
              <tr key={i} className="hover:bg-gray-100 border-b">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.phone_number}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{r.company}</td>
                <td className="p-3">{r.extra_details}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onSubmit={fetchReports} />}
    </main>
  );
}
