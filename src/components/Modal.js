import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReCAPTCHA from 'react-google-recaptcha'; // ← new import

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Submit a Recruiter</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="phone_number" className="w-full border rounded px-3 py-2" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} />
          <input name="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="company" className="w-full border rounded px-3 py-2" placeholder="Company" value={form.company} onChange={handleChange} />
          <textarea name="extra_details" className="w-full border rounded px-3 py-2" placeholder="Extra Details" value={form.extra_details} onChange={handleChange} rows={3} />
          <div className="flex justify-end gap-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={token => setCaptchaToken(token)}
          />
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
