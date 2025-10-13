'use client'

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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (isFocused) return
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value, isFocused])

  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p')
    } catch {}
  }, [])

  const onToolMouseDown = (e: React.MouseEvent) => e.preventDefault()

  const exec = (command: string, value?: string) => {
    ref.current?.focus()
    document.execCommand(command, false, value)
    if (ref.current) {
      sanitizeInPlace(ref.current)
      onChange(ref.current.innerHTML)
    }
  }

  const makeLink = () => {
    const url = prompt('Enter URL')
    if (!url) return
    exec('createLink', url)
  }

  const setHeading = (tag: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote') => {
    exec('formatBlock', tag.toUpperCase())
  }

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

  const normalizeTopLevelDivsToP = (root: HTMLElement) => {
    Array.from(root.childNodes).forEach((n) => {
      if (n.nodeType === 1 && (n as HTMLElement).tagName === 'DIV') {
        const div = n as HTMLDivElement
        const p = document.createElement('p')
        while (div.firstChild) p.appendChild(div.firstChild)
        div.replaceWith(p)
      }
    })
  }

  const sanitizeInPlace = (root: HTMLElement) => {
    normalizeTopLevelDivsToP(root)

    // Collapse <br><br> runs globally
    Array.from(root.querySelectorAll('br')).forEach((br) => {
      let n = br.nextSibling
      while (n && n.nodeType === 1 && (n as HTMLElement).tagName === 'BR') {
        const toRemove = n
        n = n.nextSibling
        toRemove.parentNode?.removeChild(toRemove)
      }
    })

    // Ensure empty paragraphs keep exactly one <br>, others remove trailing <br>s
    Array.from(root.querySelectorAll('p')).forEach((p) => {
      const hasMedia = p.querySelector('img,iframe,video,audio,svg,canvas')
      const text = (p.textContent || '').replace(/\u00A0/g, ' ').trim()
      const isEmpty = !hasMedia && text === ''

      if (isEmpty) {
        if (
          p.childNodes.length !== 1 ||
          (p.firstChild as HTMLElement)?.nodeName !== 'BR'
        ) {
          while (p.firstChild) p.removeChild(p.firstChild)
          p.appendChild(document.createElement('br'))
        }
      } else {
        while (
          p.lastChild &&
          p.lastChild.nodeType === 1 &&
          (p.lastChild as HTMLElement).tagName === 'BR'
        ) {
          p.removeChild(p.lastChild)
        }
      }
    })
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className='mb-2 flex flex-wrap items-center gap-1 rounded-md border bg-white p-1 shadow-sm'>
        <button
          type='button'
          title='Bold'
          aria-label='Bold'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('bold')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Bold className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Italic'
          aria-label='Italic'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('italic')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Italic className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Underline'
          aria-label='Underline'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('underline')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Underline className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button
          type='button'
          title='Bulleted list'
          aria-label='Bulleted list'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('insertUnorderedList')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <List className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Numbered list'
          aria-label='Numbered list'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('insertOrderedList')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <ListOrdered className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button
          type='button'
          title='Heading 1'
          aria-label='Heading 1'
          onMouseDown={onToolMouseDown}
          onClick={() => setHeading('h1')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Heading1 className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Heading 2'
          aria-label='Heading 2'
          onMouseDown={onToolMouseDown}
          onClick={() => setHeading('h2')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Heading2 className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Heading 3'
          aria-label='Heading 3'
          onMouseDown={onToolMouseDown}
          onClick={() => setHeading('h3')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Heading3 className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Heading 4'
          aria-label='Heading 4'
          onMouseDown={onToolMouseDown}
          onClick={() => setHeading('h4')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Heading4 className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Blockquote'
          aria-label='Blockquote'
          onMouseDown={onToolMouseDown}
          onClick={() => setHeading('blockquote')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Quote className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button
          type='button'
          title='Insert link'
          aria-label='Insert link'
          onMouseDown={onToolMouseDown}
          onClick={makeLink}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <LinkIcon className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button
          type='button'
          title='Align left'
          aria-label='Align left'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('justifyLeft')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <AlignLeft className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Align center'
          aria-label='Align center'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('justifyCenter')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <AlignCenter className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Align right'
          aria-label='Align right'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('justifyRight')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <AlignRight className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Justify'
          aria-label='Justify'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('justifyFull')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <AlignJustify className='h-4 w-4' />
        </button>
        <span className='mx-1 h-5 w-px bg-muted-foreground/20' />
        <button
          type='button'
          title='Undo'
          aria-label='Undo'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('undo')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Undo2 className='h-4 w-4' />
        </button>
        <button
          type='button'
          title='Redo'
          aria-label='Redo'
          onMouseDown={onToolMouseDown}
          onClick={() => exec('redo')}
          className='inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted cursor-pointer'
        >
          <Redo2 className='h-4 w-4' />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        role='textbox'
        contentEditable
        className='rte min-h-[220px] w-full rounded-md border bg-white p-3 leading-relaxed shadow-sm outline-none focus:ring-2 focus:ring-primary/20 prose prose-sm max-w-none font-serif'
        onInput={() => {
          if (!ref.current) return
          sanitizeInPlace(ref.current)
          onChange(ref.current.innerHTML)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          if (ref.current) {
            sanitizeInPlace(ref.current)
            onChange(ref.current.innerHTML)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
            document.execCommand('insertLineBreak')
            queueMicrotask(() => {
              if (ref.current) {
                sanitizeInPlace(ref.current)
                onChange(ref.current.innerHTML)
              }
            })
            return
          }

          if (e.key === 'Enter') {
            const sel = window.getSelection()
            if (sel && sel.anchorNode) {
              let node: Node | null = sel.anchorNode
              while (node && (node as HTMLElement).nodeType === 3)
                node = node.parentNode
              const el = node as HTMLElement | null
              if (el) {
                const bq = el.closest('blockquote') as HTMLElement | null
                if (bq && (bq.textContent || '').trim() === '') {
                  e.preventDefault()
                  document.execCommand('formatBlock', false, 'P')
                  return
                }
              }
            }
            setTimeout(() => {
              if (ref.current) {
                sanitizeInPlace(ref.current)
                onChange(ref.current.innerHTML)
              }
            }, 0)
            return
          }

          if (e.key === 'Escape') {
            e.preventDefault()
            document.execCommand('formatBlock', false, 'P')
          }

          if (e.key === 'Backspace') {
            const sel = window.getSelection()
            if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return
            let node: Node | null = sel.anchorNode
            while (node && (node as HTMLElement).nodeType === 3)
              node = node.parentNode
            const el = node as HTMLElement | null
            if (!el) return
            const li = el.closest('li') as HTMLElement | null
            if (li && isCaretAtStartOf(li)) {
              e.preventDefault()
              document.execCommand('outdent')
              return
            }
          }
        }}
        data-placeholder={placeholder || 'Write the article…'}
        suppressContentEditableWarning
      />

      {/* Styles */}
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgb(148 163 184);
        }

        :global(.rte a) {
          color: #2563eb;
          text-decoration: underline;
        }

        /* >>> Paragraph spacing so Enter shows a visible gap <<< */
        :global(.rte p) {
          margin: 0;
        } /* reset */
        :global(.rte p + p) {
          margin-top: 0.75rem;
        } /* one Enter = one gap */

        :global(.rte h1) {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 800;
          margin: 0.75rem 0;
        }
        :global(.rte h2) {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 700;
          margin: 0.75rem 0;
        }
        :global(.rte h3) {
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        :global(.rte h4) {
          font-size: 1rem;
          line-height: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        :global(.rte ul) {
          list-style: disc inside;
        }
        :global(.rte ol) {
          list-style: decimal inside;
        }
        :global(.rte blockquote) {
          border-left: 3px solid rgb(203 213 225);
          margin: 0.75rem 0;
          padding-left: 0.75rem;
          color: rgb(100 116 139);
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
