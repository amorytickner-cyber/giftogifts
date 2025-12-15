import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Calendar, User, ArrowLeft } from 'lucide-react';
import { supabase, Message } from '../lib/supabase';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (messageId: string, updates: Partial<Message>) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', messageId);

      if (error) throw error;

      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, ...updates });
      }
    } catch (err) {
      console.error('Error updating message:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedMessage || !reply.trim()) return;

    await updateMessage(selectedMessage.id, {
      reply: reply,
      status: 'replied',
      replied_at: new Date().toISOString(),
    });

    setReply('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'} received
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No messages yet</div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      setReply(message.reply || '');
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900">{message.parent_name}</div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          message.status
                        )}`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Child age: {message.child_age}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(message.created_at)}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedMessage.parent_name}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedMessage.parent_email}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Child age: {selectedMessage.child_age}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(selectedMessage.created_at)}
                        </div>
                      </div>
                    </div>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) =>
                        updateMessage(selectedMessage.id, {
                          status: e.target.value as Message['status'],
                        })
                      }
                      disabled={updating}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Message:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {selectedMessage.reply && (
                    <div className="bg-green-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Your Reply:</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.reply}</p>
                      {selectedMessage.replied_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Replied on {formatDate(selectedMessage.replied_at)}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      {selectedMessage.reply ? 'Update Reply:' : 'Add Reply:'}
                    </label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      placeholder="Type your gift suggestions here..."
                    />
                    <button
                      onClick={handleReplySubmit}
                      disabled={updating || !reply.trim()}
                      className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? 'Saving...' : selectedMessage.reply ? 'Update Reply' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
