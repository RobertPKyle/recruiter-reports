'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './Modal.module.css';

export default function Modal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    company: '',
    extra_details: ''
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify you're human.");
      return;
    }

    const { error } = await supabase.from('RecruiterList').insert([form]);

    if (error) {
      alert('Submission failed');
      console.error(error);
    } else {
      onSubmit();
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Submit a Recruiter</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="name" placeholder="Name (required)" value={form.name} onChange={handleChange} required />
          <input name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
          <textarea name="extra_details" placeholder="Extra Details (required)" value={form.extra_details} onChange={handleChange} required/>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={token => setCaptchaToken(token)}
          />

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
