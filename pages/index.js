import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/ask', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const agentMessage = { role: 'agent', content: data.reply };
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>ChatKangTP</h1>
      </header>

      {/* Chat Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#EAEAEA',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              maxWidth: '60%',
              whiteSpace: 'pre-wrap',
              fontSize: '1rem'
            }}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Sticky Input Bar */}
      <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{
        display: 'flex',
        padding: '1rem',
        borderTop: '1px solid #ccc',
        backgroundColor: '#fff'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '20px'
          }}
        />
        <button type="submit" style={{
          marginLeft: '0.5rem',
          fontSize: '1.2rem',
          padding: '0.75rem 1rem',
          borderRadius: '50%',
          border: 'none',
          background: '#007bff',
          color: '#fff',
          cursor: 'pointer'
        }}>
          🚀
        </button>
      </form>
    </div>
  );
}
