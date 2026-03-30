'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '80px 24px 48px',
          textAlign: 'center',
        }}
      >
        <div className="tag tag--accent" style={{ marginBottom: 24, display: 'inline-flex' }}>
          <span>👋</span> Talk to a human
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          We actually read these
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--color-secondary)',
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Not a support ticket queue. Not a chatbot. Two people who built KILN, and who will read what you send and actually respond.
        </p>
      </section>

      {/* Form */}
      <section
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        {status === 'sent' ? (
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 24,
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Message sent
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: 15, lineHeight: 1.6 }}>
              We got it. You'll hear from us soon — usually within a day or two. Check your inbox.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="btn btn--ghost"
              style={{ marginTop: 24 }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px',
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text)',
                }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ada Lovelace"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text)',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ada@babbage.co"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="message"
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text)',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what you're building, what's confusing you, or what went wrong..."
                rows={6}
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 15,
                  fontFamily: 'var(--font-body)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.15s ease',
                  lineHeight: 1.6,
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {error && (
              <p
                style={{
                  fontSize: 14,
                  color: '#d93025',
                  marginBottom: 16,
                  padding: '10px 14px',
                  background: 'rgba(217,48,37,0.06)',
                  borderRadius: 6,
                  border: '1px solid rgba(217,48,37,0.2)',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn btn--primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                fontSize: 15,
                padding: '14px',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'Sending...' : 'Send message →'}
            </button>

            <p
              style={{
                fontSize: 13,
                color: 'var(--color-secondary)',
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              We respond to every message. Usually within a day.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
