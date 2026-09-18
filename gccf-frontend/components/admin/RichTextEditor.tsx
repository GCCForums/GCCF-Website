"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Undo,
  Redo,
  RemoveFormatting,
  Code,
  Eye,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Write description here...",
  minHeight = "150px",
  required = false,
  helperText,
  className = "",
}) => {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-blue-600 underline font-medium",
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "tiptap focus:outline-none px-3.5 py-3 text-sm text-slate-800 leading-relaxed",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      isUpdatingRef.current = true;
      const html = currentEditor.isEmpty ? "" : currentEditor.getHTML();
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
  });

  // Sync external value changes into editor without jumping cursor
  useEffect(() => {
    if (!editor || isUpdatingRef.current) return;
    const currentHtml = editor.isEmpty ? "" : editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Open link dialog
  const openLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setOpenInNewTab(true);
    setLinkModalOpen(true);
  };

  // Apply or remove link
  const applyLink = () => {
    if (!editor) return;

    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkModalOpen(false);
      return;
    }

    let formattedUrl = linkUrl.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://") &&
      !formattedUrl.startsWith("mailto:") &&
      !formattedUrl.startsWith("tel:")
    ) {
      formattedUrl = `https://${formattedUrl}`;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: formattedUrl,
        target: openInNewTab ? "_blank" : "_self",
      })
      .run();

    setLinkModalOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkModalOpen(false);
  };

  if (!editor) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div
          style={{ minHeight }}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
        />
      </div>
    );
  }

  const wordCount = editor.storage.characterCount
    ? editor.storage.characterCount.words()
    : editor.getText().trim().split(/\s+/).filter(Boolean).length;

  const charCount = editor.getText().length;

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {/* Label and Header Row */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowHtmlSource(!showHtmlSource)}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#3d73bd] transition-colors cursor-pointer"
            title={showHtmlSource ? "Switch to Visual Editor" : "View / Edit HTML Source"}
          >
            {showHtmlSource ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Editor Main Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden focus-within:border-[#3d73bd] focus-within:ring-2 focus-within:ring-[#3d73bd]/20 transition-all">
        {/* Toolbar */}
        {!showHtmlSource && (
          <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-slate-50/80 border-b border-slate-200 text-slate-700 select-none">
            {/* Bold */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("bold")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("italic")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("underline")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-200 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("bulletList")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Ordered List / Number */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("orderedList")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-200 mx-1" />

            {/* Link (Href) */}
            <button
              type="button"
              onClick={openLinkDialog}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                editor.isActive("link")
                  ? "bg-[#3d73bd] text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
              title={editor.isActive("link") ? "Edit Link" : "Insert Link"}
            >
              <Link2 className="w-4 h-4" />
            </button>

            {/* Unlink */}
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={removeLink}
                className="p-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title="Remove Link"
              >
                <Link2Off className="w-4 h-4" />
              </button>
            )}

            <span className="w-px h-4 bg-slate-200 mx-1" />

            {/* Clear Formatting */}
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              className="p-1.5 rounded-lg text-xs font-medium hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              title="Clear Formatting"
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>

            {/* Undo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded-lg text-xs font-medium hover:bg-slate-200/70 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>

            {/* Redo */}
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded-lg text-xs font-medium hover:bg-slate-200/70 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Link Input Dialog Modal / Popover */}
        {linkModalOpen && (
          <div className="p-3 bg-blue-50/70 border-b border-blue-200 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    } else if (e.key === "Escape") {
                      setLinkModalOpen(false);
                    }
                  }}
                  autoFocus
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/30"
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded text-[#3d73bd] focus:ring-[#3d73bd]"
                />
                <span>Open in new tab</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={applyLink}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3d73bd] text-white hover:bg-[#1d3c68] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Unlink
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="p-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body: WYSIWYG vs Raw HTML */}
        {showHtmlSource ? (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            rows={6}
            placeholder="<p>Enter HTML directly here...</p>"
            className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 focus:outline-none resize-y"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="cursor-text bg-white overflow-y-auto"
            onClick={() => editor.commands.focus()}
          >
            <EditorContent editor={editor} />
          </div>
        )}

        {/* Footer Status Bar */}
        <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          <span className="text-[10px] text-slate-400">Rich Text Formatted</span>
        </div>
      </div>

      {/* Helper text */}
      {helperText && (
        <p className="text-[11px] text-slate-500 pl-0.5">{helperText}</p>
      )}
    </div>
  );
};

export default RichTextEditor;
