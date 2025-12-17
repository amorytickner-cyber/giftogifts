import { useState } from 'react';
import { Gift, Send, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    childAge: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('messages')
        .insert([
          {
            parent_name: formData.parentName,
            parent_email: formData.parentEmail,
            child_age: parseInt(formData.childAge),
            message: formData.message,
          },
        ]);

      if (submitError) throw submitError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-message-email`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          parentName: formData.parentName,
          parentEmail: formData.parentEmail,
          childAge: formData.childAge,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email notification');
      }

      setSubmitted(true);
      setFormData({ parentName: '', parentEmail: '', childAge: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-400 to-orange-300 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-fuchsia-600 bg-clip-text text-transparent mb-2">Message Sent!</h2>
          <p className="text-gray-700 mb-6 font-medium">
            Thanks for reaching out! I'll get back to you soon with some awesome gift ideas.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-orange-200 to-amber-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-fuchsia-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-fuchsia-600 rounded-full mb-6 shadow-lg transform hover:scale-110 transition-transform">
            <Gift className="w-10 h-10 text-white animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Need Gift Ideas?
          </h1>
          <p className="text-2xl font-bold text-orange-700 mb-3">
            I'm a kid, and I know what kids really want!
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Stuck on what to get your child? Message me and I'll help you find the perfect present
            that they'll actually love. No more guessing!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-orange-200">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-fuchsia-600" />
            <h2 className="text-3xl font-black bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">Ask Me Anything!</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="parentName" className="block text-sm font-bold text-gray-800 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                required
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all bg-orange-50 placeholder-gray-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="group">
              <label htmlFor="parentEmail" className="block text-sm font-bold text-gray-800 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                required
                value={formData.parentEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-rose-50 placeholder-gray-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="group">
              <label htmlFor="childAge" className="block text-sm font-bold text-gray-800 mb-2">
                How old is your child?
              </label>
              <input
                type="number"
                id="childAge"
                name="childAge"
                required
                min="1"
                max="18"
                value={formData.childAge}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-amber-50 placeholder-gray-500"
                placeholder="Age"
              />
            </div>

            <div className="group">
              <label htmlFor="message" className="block text-sm font-bold text-gray-800 mb-2">
                Tell me about your child and what you're looking for
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all resize-none bg-cyan-50 placeholder-gray-500"
                placeholder="What are their interests? Any specific occasion? Budget range? The more details, the better I can help!"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500 text-white font-black py-4 px-6 rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-bold text-orange-800">I'll reply to your email as soon as I can!</p>
        </div>
      </div>
    </div>
  );
}
