'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Modal from '../components/Modal';
import styles from './page.module.css';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('RecruiterList')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    Object.values(report).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <main className={styles.container}>
      <div className={styles.logo}>Report A Recruiter</div>
<p className={styles.subtitle}>Browse reported recruiters or submit a new one</p>
      

      <div className={styles.columns}>
  <div className={styles.leftColumn}>
    <input className={styles.searchInput}
            placeholder="Search Recruiters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Extra Details</th>
                  <th>Reported</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.phone_number}</td>
                    <td>{r.email}</td>
                    <td>{r.company}</td>
                    <td>{r.extra_details}</td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

         <div className={styles.rightColumn}>
    <button
      className={styles.actionButton}
      onClick={() => setShowModal(true)}
    >
      Submit
    </button>

    <a
      href="https://buymeacoffee.com/tomatorob"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.actionButton} ${styles.supportButton}`}
    >
      Support
    </a>
  </div>
</div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onSubmit={fetchReports} />
      )}
    </main>
  );
}
