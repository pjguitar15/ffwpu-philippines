"use client"

import { useEffect, useRef, useState } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Undo2,
  Redo2,
} from 'lucide-react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Keep editor in sync with value (but don't fight user while typing)
  useEffect(() => {
    if (!ref.current) return
    if (isFocused) return
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value, isFocused])

  // Prefer paragraphs on Enter
  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p')
    } catch {}
  }, [])

  // Keep the current selection when clicking toolbar buttons
  const onToolMouseDown = (e: React.MouseEvent) => {
    // Prevent button from taking focus away from the editor so selection stays
    e.preventDefault()
  }

  const exec = (command: string, value?: string) => {
    // Focus editor before running command
    ref.current?.focus()
    document.execCommand(command, false, value)
    // Emit change
    onChange(ref.current?.innerHTML || '')
  }

  const makeLink = () => {
    const url = prompt('Enter URL')
    if (!url) return
    exec('createLink', url)
  }

  const setHeading = (tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote') => {
    exec('formatBlock', tag.toUpperCase())
  }

  // Helpers to inspect and modify selection
  const getSelection = () => window.getSelection()
  const isCaretAtStartOf = (el: HTMLElement) => {
    const sel = getSelection()
    if (!sel || sel.rangeCount === 0) return false
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true)
    const start = document.createRange()
    start.setStart(el, 0)
    start.collapse(true)
    return range.compareBoundaryPoints(Range.START_TO_START, start) === 0
  }
  const placeCaretAtStart = (el: HTMLElement) => {
    const sel = getSelection()
    if (!sel) return
    const range = document.createRange()
    // If element has a text node, place at its start; else at element start
    if (el.firstChild) {
      range.setStart(el.firstChild, 0)
    } else {
      range.setStart(el, 0)
    }
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className='mb-2 flex flex-wrap items-center gap-1 rounded-md border bg-white p-1 shadow-sm'>
        <button type='button' title='Bold' aria-label='Bold' onMouseDown={onToolMouseDown} onClick={() => exec('bold')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Bold className='h-4 w-4' />
        </button>
        <button type='button' title='Italic' aria-label='Italic' onMouseDown={onToolMouseDown} onClick={() => exec('italic')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Italic className='h-4 w-4' />
        </button>
        <button type='button' title='Underline' aria-label='Underline' onMouseDown={onToolMouseDown} onClick={() => exec('underline')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Underline className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button type='button' title='Bulleted list' aria-label='Bulleted list' onMouseDown={onToolMouseDown} onClick={() => exec('insertUnorderedList')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <List className='h-4 w-4' />
        </button>
        <button type='button' title='Numbered list' aria-label='Numbered list' onMouseDown={onToolMouseDown} onClick={() => exec('insertOrderedList')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <ListOrdered className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button type='button' title='Heading 1' aria-label='Heading 1' onMouseDown={onToolMouseDown} onClick={() => setHeading('h1')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Heading1 className='h-4 w-4' />
        </button>
        <button type='button' title='Heading 2' aria-label='Heading 2' onMouseDown={onToolMouseDown} onClick={() => setHeading('h2')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Heading2 className='h-4 w-4' />
        </button>
        <button type='button' title='Heading 3' aria-label='Heading 3' onMouseDown={onToolMouseDown} onClick={() => setHeading('h3')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Heading3 className='h-4 w-4' />
        </button>
        <button type='button' title='Heading 4' aria-label='Heading 4' onMouseDown={onToolMouseDown} onClick={() => setHeading('h4')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Heading4 className='h-4 w-4' />
        </button>
        <button type='button' title='Blockquote' aria-label='Blockquote' onMouseDown={onToolMouseDown} onClick={() => setHeading('blockquote')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Quote className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button type='button' title='Insert link' aria-label='Insert link' onMouseDown={onToolMouseDown} onClick={makeLink} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <LinkIcon className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button type='button' title='Undo' aria-label='Undo' onMouseDown={onToolMouseDown} onClick={() => exec('undo')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Undo2 className='h-4 w-4' />
        </button>
        <button type='button' title='Redo' aria-label='Redo' onMouseDown={onToolMouseDown} onClick={() => exec('redo')} className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'>
          <Redo2 className='h-4 w-4' />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        role='textbox'
        contentEditable
        className='rte min-h-[220px] w-full rounded-md border bg-white p-3 leading-relaxed shadow-sm outline-none focus:ring-2 focus:ring-primary/20 prose prose-sm max-w-none'
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          // Press Enter twice on an empty blockquote to exit to a new paragraph
          if (e.key === 'Enter') {
            const sel = window.getSelection()
            if (sel && sel.anchorNode) {
              let node: Node | null = sel.anchorNode
              while (node && (node as HTMLElement).nodeType === 3) node = node.parentNode
              const el = node as HTMLElement | null
              if (el && el.closest('blockquote')) {
                // If the blockquote is empty, convert to paragraph instead of adding new line
                const container = el.closest('blockquote') as HTMLElement
                if (container && container.textContent?.trim() === '') {
                  e.preventDefault()
                  exec('formatBlock', 'P')
                  return
                }
              }
            }
          }
          // Escape exits current block formatting back to paragraph
          if (e.key === 'Escape') {
            e.preventDefault()
            exec('formatBlock', 'P')
          }
          // Smooth Backspace behavior at start of list items: outdent instead of weird merges
          if (e.key === 'Backspace') {
            const sel = window.getSelection()
            if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return
            let node: Node | null = sel.anchorNode
            while (node && (node as HTMLElement).nodeType === 3) node = node.parentNode
            const el = node as HTMLElement | null
            if (!el) return
            const li = el.closest('li') as HTMLElement | null
            if (li && isCaretAtStartOf(li)) {
              e.preventDefault()
              exec('outdent')
              return
            }
          }
        }}
        data-placeholder={placeholder || 'Write the article…'}
        suppressContentEditableWarning
      />

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgb(148 163 184); /* slate-400 */
        }
  :global(.rte a) {
          color: #2563eb; /* blue-600 */
          text-decoration: underline;
        }
  :global(.rte h1) { font-size: 1.5rem; line-height: 2rem; font-weight: 800; margin: 0.75rem 0; }
  :global(.rte h2) { font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin: 0.75rem 0; }
  :global(.rte h3) { font-size: 1.125rem; line-height: 1.75rem; font-weight: 700; margin: 0.5rem 0; }
  :global(.rte h4) { font-size: 1rem; line-height: 1.5rem; font-weight: 700; margin: 0.5rem 0; }
        :global(.rte ul) {
          list-style: disc inside;
        }
        :global(.rte ol) {
          list-style: decimal inside;
        }
        :global(.rte blockquote) {
          border-left: 3px solid rgb(203 213 225); /* slate-300 */
          margin: 0.75rem 0;
          padding-left: 0.75rem;
          color: rgb(100 116 139); /* slate-500 */
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
