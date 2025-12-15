import { useState } from 'react';
import { Gift, Send, CheckCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thanks for reaching out! I'll get back to you soon with some awesome gift ideas.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Need Gift Ideas?
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            I'm a kid, and I know what kids really want!
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stuck on what to get your child? Message me and I'll help you find the perfect present
            that they'll actually love. No more guessing!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask Me Anything!</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                required
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                required
                value={formData.parentEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Age"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Tell me about your child and what you're looking for
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="What are their interests? Any specific occasion? Budget range? The more details, the better I can help!"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>I'll reply to your email as soon as I can!</p>
        </div>
      </div>
    </div>
  );
}
