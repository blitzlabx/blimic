import React, { useState } from 'react';
import { FIELD_GUIDE_ARTICLES, FieldGuideArticle } from '../../data/fieldGuideArticles';
import { ComparativeMatrixTable } from './ComparativeMatrixTable';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, Tag, X, ChevronRight, Compass, Layers } from 'lucide-react';

interface FieldGuideSectionProps {
  bodies: CelestialBodyData[];
  onSelectBody: (id: string) => void;
}

export const FieldGuideSection: React.FC<FieldGuideSectionProps> = ({
  bodies,
  onSelectBody,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<FieldGuideArticle | null>(null);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'orbital-mechanics', label: 'Orbital Mechanics' },
    { id: 'rocky-worlds', label: 'Planetary Science' },
    { id: 'gas-giants', label: 'Gas & Ice Giants' },
    { id: 'dwarf-planets', label: 'Outer Frontiers' },
    { id: 'solar-physics', label: 'Solar Physics' },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? FIELD_GUIDE_ARTICLES
    : FIELD_GUIDE_ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <section id="field-guide" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-subtle">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald">Astrophysics Field Guide</Badge>
            <span className="text-xs text-secondary font-mono">Curated Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary font-display">
            Astronomical Principles & Science
          </h2>
          <p className="text-sm text-secondary max-w-2xl mt-1">
            Explore authoritative essays on Keplerian orbital geometry, planetary atmospheric evolution, and deep space exploration mechanics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/50 font-semibold'
                  : 'bg-surface text-secondary hover:text-primary border border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setReadingArticle(article)}
            className="group bg-surface border border-subtle hover:border-hover rounded-sm p-6 flex flex-col justify-between cursor-pointer transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="emerald">
                  {article.categoryLabel}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] font-mono text-secondary">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes} min read
                </span>
              </div>

              <h3 className="text-lg font-bold text-primary font-display group-hover:text-emerald-300 transition-colors">
                {article.title}
              </h3>

              <p className="text-xs font-mono text-emerald-400/80">
                {article.subtitle}
              </p>

              <p className="text-xs text-secondary leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-sm bg-canvas border border-subtle text-[10px] font-mono text-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                <span>Read</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <ComparativeMatrixTable bodies={bodies} onSelectBody={onSelectBody} />
      </div>

      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="fixed inset-0 -z-10" onClick={() => setReadingArticle(null)} />

          <div className="relative w-full max-w-3xl bg-surface border border-subtle rounded-none sm:rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[100vh] sm:max-h-[90vh] my-auto">
            <div className="p-4 sm:p-6 border-b border-subtle bg-canvas/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="emerald">{readingArticle.categoryLabel}</Badge>
                  <span className="text-xs font-mono text-secondary">{readingArticle.readingTimeMinutes} min read</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary font-display">
                  {readingArticle.title}
                </h2>
                <p className="text-xs font-mono text-emerald-400 mt-1">{readingArticle.subtitle}</p>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-2 rounded-sm bg-surface hover:bg-surface-elevated text-secondary hover:text-primary"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-secondary leading-relaxed">
              <div className="bg-emerald-950/20 border-l-2 border-emerald-400 p-4 rounded-r-sm">
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                  Executive Summary
                </span>
                <p className="text-xs sm:text-sm text-secondary">
                  {readingArticle.summary}
                </p>
              </div>

              {readingArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-primary font-display border-b border-subtle pb-1.5">
                    {sec.heading}
                  </h3>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}

              <div className="bg-surface border border-subtle rounded-sm p-4 space-y-2">
                <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block">
                  Core Scientific Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-secondary">
                  {readingArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-subtle bg-canvas/50 flex items-center justify-between text-xs font-mono text-secondary">
              <span>blimic Field Guide</span>
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-1.5 rounded-sm bg-surface hover:bg-surface-elevated text-primary transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};