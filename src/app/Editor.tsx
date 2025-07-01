"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DownloadIcon, CodeIcon, TextIcon, FontBoldIcon, FontItalicIcon, UnderlineIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const codeTemplates: Record<string, string> = {
  py: '# Python code here\n',
  cpp: '// C++ code here\n',
  cp: '// Competitive programming template here\n',
};

const FONT_SIZES = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '18px' },
  { label: 'Large', value: '24px' },
  { label: 'Extra Large', value: '32px' },
];

export default function Editor() {
  const [mode, setMode] = useState<'code' | 'text'>('code');
  const [code, setCode] = useState(codeTemplates['py']);
  const [lang, setLang] = useState<'py' | 'cpp' | 'cp'>('py');
  const [isFocused, setIsFocused] = useState(false);
  const [fontSize, setFontSize] = useState('18px');

  // Pages state for text mode
  const [pages, setPages] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Export code as file
  const exportCode = (ext: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `export.${ext}`;
    a.click();
  };

  // Export text as docx or pdf (stub)
  const exportText = (type: 'docx' | 'pdf') => {
    // TODO: Implement real export logic
    alert(`Exporting as ${type} (not implemented)`);
  };

  // Rich text formatting
  const format = (command: 'bold' | 'italic' | 'underline') => {
    document.execCommand(command);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      updatePageContent(html);
    }
  };

  // Update current page content
  const updatePageContent = (html: string) => {
    setPages(pgs => pgs.map((p, i) => (i === currentPage ? html : p)));
  };

  // Handle input in contentEditable
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = (e.target as HTMLDivElement).innerHTML;
    updatePageContent(html);
  };

  // Add new page
  const addPage = () => {
    setPages(pgs => [...pgs, '']);
    setCurrentPage(pages.length);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  };

  // Switch page
  const goToPage = (idx: number) => {
    setCurrentPage(idx);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 0);
  };

  // Set editor content when switching pages or font size
  useEffect(() => {
    if (mode === 'text' && editorRef.current) {
      editorRef.current.innerHTML = pages[currentPage] || '';
    }
  }, [currentPage, fontSize, mode]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-2">
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition ${mode === 'code' ? 'bg-black text-white' : 'bg-white/80 text-black border border-gray-300'}`}
          onClick={() => setMode('code')}
        >
          <CodeIcon /> Code
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition ${mode === 'text' ? 'bg-yellow-100 text-black' : 'bg-white/80 text-black border border-gray-300'}`}
          onClick={() => setMode('text')}
        >
          <TextIcon /> Text
        </button>
      </div>
      {/* Language Selector for Code */}
      {mode === 'code' && (
        <div className="flex gap-2 mb-2">
          <label className="font-semibold">Language:</label>
          <select
            className="rounded px-2 py-1 border border-gray-300"
            value={lang}
            onChange={e => {
              setLang(e.target.value as 'py' | 'cpp' | 'cp');
              setCode(codeTemplates[e.target.value as 'py' | 'cpp' | 'cp']);
            }}
          >
            <option value="py">Python (.py)</option>
            <option value="cpp">C++ (.cpp)</option>
            <option value="cp">CP Template (.cp)</option>
          </select>
        </div>
      )}
      {/* Toolbar and Page Navigation for Text Mode */}
      {mode === 'text' && (
        <>
          <div className="flex flex-wrap gap-2 p-2 bg-[#f8f5f0] border-b border-gray-200 rounded-t-2xl items-center">
            <button
              type="button"
              className="p-2 rounded hover:bg-blue-100"
              title="Bold"
              onMouseDown={e => { e.preventDefault(); format('bold'); }}
            >
              <FontBoldIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded hover:bg-blue-100"
              title="Italic"
              onMouseDown={e => { e.preventDefault(); format('italic'); }}
            >
              <FontItalicIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded hover:bg-blue-100"
              title="Underline"
              onMouseDown={e => { e.preventDefault(); format('underline'); }}
            >
              <UnderlineIcon className="w-5 h-5" />
            </button>
            {/* Font Size Selector */}
            <label className="ml-4 font-medium text-gray-700">Font Size:</label>
            <select
              className="rounded px-2 py-1 border border-gray-300"
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
            >
              {FONT_SIZES.map(fs => (
                <option key={fs.value} value={fs.value}>{fs.label}</option>
              ))}
            </select>
          </div>
          {/* Page Navigation */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#f8f5f0] border-b border-gray-200">
            <button
              className="p-2 rounded hover:bg-blue-100"
              onClick={() => goToPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              title="Previous Page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            {pages.map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded ${currentPage === idx ? 'bg-blue-200 text-blue-900 font-bold' : 'bg-white text-gray-700'} border border-gray-200`}
                onClick={() => goToPage(idx)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="p-2 rounded hover:bg-blue-100"
              onClick={addPage}
              title="Add Page"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded hover:bg-blue-100"
              onClick={() => goToPage(Math.min(pages.length - 1, currentPage + 1))}
              disabled={currentPage === pages.length - 1}
              title="Next Page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            <span className="ml-4 text-gray-500">Page {currentPage + 1} of {pages.length}</span>
          </div>
        </>
      )}
      {/* Editor Area */}
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        {mode === 'code' ? (
          <div className="bg-black">
            <MonacoEditor
              height="400px"
              language={lang === 'py' ? 'python' : 'cpp'}
              theme="vs-dark"
              value={code}
              onChange={v => setCode(v || '')}
              options={{ fontSize: 16, minimap: { enabled: false } }}
            />
          </div>
        ) : (
          <div className="relative">
            <div
              ref={editorRef}
              className="w-full h-96 p-6 pt-4 text-lg rounded-b-2xl border border-gray-200 bg-[#f8f5f0] font-[Times_New_Roman,serif] resize-none shadow-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all outline-none overflow-auto relative"
              style={{
                fontFamily: 'Times New Roman, Times, serif',
                fontSize: fontSize,
                background: 'linear-gradient(135deg, #f8f5f0 80%, #f3e9dc 100%)',
                boxShadow: '0 4px 32px 0 rgba(80,60,30,0.07), 0 1.5px 6px 0 rgba(180,160,120,0.04)',
                border: isFocused ? '2px solid #60a5fa' : '1px solid #e5e7eb',
              }}
              contentEditable
              suppressContentEditableWarning
              spellCheck={true}
              onInput={handleInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {/* Subtle paper texture overlay (optional) */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-10" style={{backgroundImage: 'url(\"https://www.transparenttextures.com/patterns/paper-fibers.png\")'}} />
          </div>
        )}
      </div>
      {/* Export Buttons */}
      <div className="flex gap-4 mt-2">
        {mode === 'code' ? (
          <>
            <button onClick={() => exportCode(lang)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
              <DownloadIcon /> Export .{lang}
            </button>
            {/* TODO: Add GitHub push button */}
          </>
        ) : (
          <>
            <button onClick={() => exportText('docx')} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
              <DownloadIcon /> Export .docx
            </button>
            <button onClick={() => exportText('pdf')} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
              <DownloadIcon /> Export .pdf
            </button>
          </>
        )}
      </div>
    </div>
  );
} 