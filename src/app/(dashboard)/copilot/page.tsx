'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Copy, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';
import { motion } from 'framer-motion';

export default function CopilotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `### 👋 Welcome to RevenueShield AI Copilot

Connected to live database context for **${user?.organizationName || 'Merchant Org'}**.

Ask me anything about your payments, for example:
- 🚨 **Live Bank Anomalies** & OTP server timeouts
- ⚡ **Payment Recovery Playbooks** & smart retry rules
- 📊 **Failure Cause Breakdown** across HDFC, ICICI, SBI & UPI handles
- 💳 **UPI vs Credit Card** performance comparison
- 🔍 **Recent customer transaction failures & status**
- 💰 **Executive Revenue Impact** & recoverable cashflow`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || input;
    if (!queryToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: queryToSend };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, data.message]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: '⚠️ Encountered an issue processing query. Please retry.' },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Unable to reach Copilot API server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePrompts = [
    { label: '🚨 Bank Downtime', query: 'Are there any active bank downtime anomalies affecting UPI payments?' },
    { label: '⚡ Failure Recovery Rules', query: 'How to recover pending failed payments using smart auto-retry?' },
    { label: '💳 UPI vs Cards', query: 'Compare UPI vs Credit Card recovery efficiency and success rates.' },
    { label: '🔍 Recent Failures', query: 'Show me recent failed transactions and customer details.' },
    { label: '💰 Revenue Impact', query: 'How much money can I recover today from pending failures?' },
  ];

  // Render inline text elements including bold and code
  const renderInline = (text: string) => {
    // First split by code blocks `code`
    const codeParts = text.split(/(`.*?`)/g);
    return codeParts.map((codePart, cIdx) => {
      if (codePart.startsWith('`') && codePart.endsWith('`')) {
        return (
          <code key={cIdx} className="font-mono text-xs font-bold bg-[#E8B563]/15 dark:bg-black text-[#E8B563] px-2 py-0.5 rounded-md border border-[#E8B563]/30">
            {codePart.slice(1, -1)}
          </code>
        );
      }

      // Parse bold **bold**
      const boldParts = codePart.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((boldPart, bIdx) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
          return (
            <strong key={bIdx} className="font-extrabold text-slate-950 dark:text-[#E8B563] bg-[#E8B563]/10 dark:bg-[#E8B563]/15 px-1 py-0.5 rounded border border-[#E8B563]/25">
              {boldPart.slice(2, -2)}
            </strong>
          );
        }
        return boldPart;
      });
    });
  };

  // Helper to render formatted Markdown text, headers, lists, and markdown tables cleanly
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length === 0) return;
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter((r) => !r[0]?.includes('---'));

      elements.push(
        <div key={key} className="my-4 overflow-x-auto rounded-xl border border-[#E8B563]/30 bg-slate-50/80 dark:bg-black/50 shadow-lg">
          <table className="w-full text-xs sm:text-sm border-collapse text-left">
            <thead>
              <tr className="bg-slate-200/70 dark:bg-[#1A1A1A] border-b border-[#E8B563]/30">
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-extrabold text-slate-900 dark:text-[#E8B563] uppercase text-[11px] tracking-wider">
                    {renderInline(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-200/60 dark:border-white/10 hover:bg-[#E8B563]/10 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-slate-800 dark:text-[#F5F0E8] font-medium">
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('|')) {
        inTable = true;
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(`table-${index}`);
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base sm:text-lg font-extrabold text-[#E8B563] mt-5 mb-2 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 tracking-tight">
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#E8B563] mt-4 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-[#E8B563]" />
            <span>{line.replace('#### ', '')}</span>
          </h4>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <div key={index} className="flex items-start gap-2.5 my-1.5 text-xs sm:text-sm text-slate-800 dark:text-[#F5F0E8] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B563] mt-2 shrink-0" />
            <div className="flex-1">{renderInline(itemText)}</div>
          </div>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        const itemText = line.trim().replace(/^\d+\.\s+/, '');
        const num = line.trim().match(/^(\d+)\./)?.[1] || '1';
        elements.push(
          <div key={index} className="flex items-start gap-2.5 my-1.5 text-xs sm:text-sm text-slate-800 dark:text-[#F5F0E8] leading-relaxed">
            <span className="font-bold text-[#E8B563] text-xs bg-[#E8B563]/15 border border-[#E8B563]/30 px-1.5 py-0.5 rounded shrink-0">{num}</span>
            <div className="flex-1">{renderInline(itemText)}</div>
          </div>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="text-xs sm:text-sm leading-relaxed my-1 text-slate-800 dark:text-[#F5F0E8]">
            {renderInline(line)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable('table-end');
    }

    return elements;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F0E8] flex items-center gap-2">
            <Bot className="h-6 w-6 text-[#E8B563]" />
            <span>AI Copilot Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
            Conversational revenue intelligence powered by live database telemetry & Anthropic AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8B563]/15 border border-[#E8B563]/30 text-[#E8B563] text-xs font-mono font-bold shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Claude 3.5 Sonnet / RevenueShield Engine</span>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-2xl flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((m, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={index}
              className={`flex items-start gap-3.5 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs shadow-lg ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-[#E8B563] to-amber-500 text-slate-950 border border-[#E8B563]'
                    : 'bg-slate-100 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#E8B563]/40 text-[#E8B563]'
                }`}
              >
                {m.role === 'user' ? <User className="h-5 w-5 stroke-[2.5]" /> : <Bot className="h-5 w-5 stroke-[2.5]" />}
              </div>

              {/* Bubble Content */}
              <div
                className={`max-w-4xl p-5 sm:p-7 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] text-slate-950 font-bold rounded-tr-none shadow-xl border border-[#E8B563]/50'
                    : 'bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/15 text-slate-800 dark:text-[#F5F0E8] rounded-tl-none font-sans shadow-xl'
                }`}
              >
                {m.role === 'user' ? m.content : renderMessageContent(m.content)}

                {/* Assistant Copy Action */}
                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.content, index)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-600 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#F5F0E8] transition-all opacity-0 group-hover:opacity-100 shadow-md"
                    title="Copy Answer"
                  >
                    {copiedIndex === index ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-3.5 animate-in fade-in duration-200">
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#E8B563]/40 text-[#E8B563] flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 animate-spin text-[#E8B563]" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-white/15 text-xs sm:text-sm text-slate-600 dark:text-[#8A8A8A] animate-pulse flex items-center gap-2.5 font-medium shadow-md">
                <Sparkles className="h-4 w-4 text-[#E8B563] animate-bounce" />
                <span>Evaluating database telemetry, payment rules & generating accurate answer...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0E0E0E] flex flex-wrap gap-2">
          {samplePrompts.map((item, i) => (
            <button
              key={i}
              onClick={(e) => handleSend(e, item.query)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#161616] hover:bg-[#E8B563]/15 hover:border-[#E8B563]/40 text-xs text-slate-700 dark:text-[#8A8A8A] hover:text-slate-900 dark:hover:text-[#E8B563] font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSend(e)} className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot anything about your payment failures, customer txns, UPI vs Card metrics..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1A1A1A] text-slate-900 dark:text-[#F5F0E8] placeholder-slate-400 dark:placeholder-[#666] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#E8B563] focus:border-[#E8B563] outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8B563] via-amber-500 to-[#E8B563] hover:brightness-110 disabled:opacity-40 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#E8B563]/25 flex items-center gap-2 active:scale-95 shrink-0"
          >
            <span>Send</span>
            <Send className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}
