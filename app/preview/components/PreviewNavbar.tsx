'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePreview } from '../PreviewContext'

const GITHUB_URL = 'https://github.com/AbinVarghexe/componetui'

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.25 12.5C10.1495 12.5 12.5 10.1495 12.5 7.25C12.5 4.35051 10.1495 2 7.25 2C4.35051 2 2 4.35051 2 7.25C2 10.1495 4.35051 12.5 7.25 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5L9.79 5.84L14.5 6.15L10.92 9.26L12.02 13.85L8 11.34L3.98 13.85L5.08 9.26L1.5 6.15L6.21 5.84L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PreviewNavbar() {
  const { language, setLanguage, styling, setStyling, openSearch } = usePreview()
  const [stars, setStars] = useState<string>('')

  useEffect(() => {
    fetch("https://api.github.com/repos/AbinVarghexe/componetui")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stargazers");
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          const count = data.stargazers_count;
          if (count >= 1000) {
            setStars(` (${(count / 1000).toFixed(1)}k)`);
          } else {
            setStars(` (${count})`);
          }
        }
      })
      .catch((err) => {
        console.warn("GitHub API error:", err);
      });
  }, []);

  return (
    <nav className="preview-navbar preview-layout-navbar" id="preview-navbar">
      <Link href="/" className="preview-navbar-brand">
        Gamin UI
      </Link>

      <button
        className="preview-navbar-search-trigger"
        onClick={openSearch}
        id="search-trigger"
        type="button"
      >
        <SearchIcon />
        <span>Search components…</span>
        <span className="kbd">Ctrl K</span>
      </button>

      <div className="preview-navbar-actions">
        {/* Language toggle */}
        <div className="toggle-pill-group" id="language-toggle">
          <button
            className={`toggle-pill-option ${language === 'javascript' ? 'toggle-pill-option-active' : ''}`}
            onClick={() => setLanguage('javascript')}
            type="button"
          >
            JS
          </button>
          <button
            className={`toggle-pill-option ${language === 'typescript' ? 'toggle-pill-option-active' : ''}`}
            onClick={() => setLanguage('typescript')}
            type="button"
          >
            TS
          </button>
        </div>

        {/* Styling toggle */}
        <div className="toggle-pill-group" id="styling-toggle">
          <button
            className={`toggle-pill-option ${styling === 'css' ? 'toggle-pill-option-active' : ''}`}
            onClick={() => setStyling('css')}
            type="button"
          >
            CSS
          </button>
          <button
            className={`toggle-pill-option ${styling === 'tailwind' ? 'toggle-pill-option-active' : ''}`}
            onClick={() => setStyling('tailwind')}
            type="button"
          >
            Tailwind
          </button>
        </div>

        {/* GitHub star */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="github-button"
          id="github-star-button"
        >
          <GitHubIcon />
          <StarIcon />
          <span>Star{stars}</span>
        </a>
      </div>
    </nav>
  )
}
