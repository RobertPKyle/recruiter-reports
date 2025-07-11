// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';

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
    <main className="p-6 font-sans text-gray-800">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">🚨 Recruiter Watch</h1>
        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
          <a href="https://buymeacoffee.com/supportdev" target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">Support</a>
        </div>
      </div>

      <div className="mb-4">
        <input
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Search recruiters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-auto border rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Extra Details</th>
              <th className="p-2">Reported</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.phone_number}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.company}</td>
                <td className="p-2">{r.extra_details}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} onSubmit={fetchReports} />}
    </main>
  );
}
