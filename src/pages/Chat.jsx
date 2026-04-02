import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToMessages, sendMessage, getConversations } from '../services/messageService';
import { Send, User, Home, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToMessages(currentUser.uid, (msgs) => {
      setMessages(msgs);
      const convos = getConversations(msgs, currentUser.uid);
      setConversations(convos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvo, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    try {
      await sendMessage(
        currentUser.uid,
        currentUser.displayName || 'User',
        selectedConvo.otherId,
        selectedConvo.propertyId,
        selectedConvo.propertyTitle,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex h-[calc(100vh-100px)] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border overflow-hidden shadow-sm">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((convo, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedConvo(convo)}
                className={`w-full p-4 border-b text-left transition hover:bg-gray-50 ${selectedConvo?.otherId === convo.otherId && selectedConvo?.propertyId === convo.propertyId ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{convo.otherName}</p>
                    <p className="text-xs text-primary-600 flex items-center gap-1">
                      <Home size={10} /> {convo.propertyTitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate ml-13">{convo.lastMessage}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConvo ? 'hidden md:flex items-center justify-center bg-gray-50' : 'flex bg-white'}`}>
        {!selectedConvo ? (
          <div className="text-center text-gray-400">
            <MessageSquare size={64} className="mx-auto mb-4 opacity-10" />
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-4 bg-white/80 backdrop-blur sticky top-0 z-10">
              <button onClick={() => setSelectedConvo(null)} className="md:hidden p-2 text-gray-500">
                <ArrowLeft size={20} />
              </button>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{selectedConvo.otherName}</h3>
                <p className="text-xs text-gray-500">{selectedConvo.propertyTitle}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages
                .filter(m => (m.senderId === selectedConvo.otherId || m.receiverId === selectedConvo.otherId) && m.propertyId === selectedConvo.propertyId)
                .map((msg) => {
                  const isMe = msg.senderId === currentUser.uid;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition bg-gray-50"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition shadow-md disabled:bg-gray-300 disabled:shadow-none"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
