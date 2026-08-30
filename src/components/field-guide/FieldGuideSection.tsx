import React, { useState } from 'react';
import { FIELD_GUIDE_ARTICLES, FieldGuideArticle } from '../../data/fieldGuideArticles';
import { ComparativeMatrixTable } from './ComparativeMatrixTable';
import { CelestialBodyData } from '../../types/astronomy';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, Tag, X, ChevronRight, Compass, Sparkles, Layers } from 'lucide-react';

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
    <section id="field-guide" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-gray-800/80">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-gray-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan">Astrophysics Field Guide</Badge>
            <span className="text-xs text-gray-400 font-mono">Curated Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Astronomical Principles & Science
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mt-1">
            Explore authoritative essays on Keplerian orbital geometry, planetary atmospheric evolution, and deep space exploration mechanics.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold'
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setReadingArticle(article)}
            className="group bg-gray-950/80 border border-gray-800/80 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:bg-gray-900/40"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="cyan">
                  {article.categoryLabel}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes} min read
                </span>
              </div>

              <h3 className="text-lg font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-xs font-mono text-cyan-400/80">
                {article.subtitle}
              </p>

              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {article.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] font-mono text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Read</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Data Matrix */}
      <div className="mt-16">
        <ComparativeMatrixTable bodies={bodies} onSelectBody={onSelectBody} />
      </div>

      {/* Article Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="fixed inset-0 -z-10" onClick={() => setReadingArticle(null)} />
          
          <div className="relative w-full max-w-3xl bg-gray-950 border border-gray-800 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[100vh] sm:max-h-[90vh] my-auto">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-800/80 bg-gray-900/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="cyan">{readingArticle.categoryLabel}</Badge>
                  <span className="text-xs font-mono text-gray-400">{readingArticle.readingTimeMinutes} min read</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {readingArticle.title}
                </h2>
                <p className="text-xs font-mono text-cyan-400 mt-1">{readingArticle.subtitle}</p>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-gray-300 leading-relaxed font-normal">
              
              {/* Summary Callout */}
              <div className="bg-cyan-950/20 border-l-2 border-cyan-400 p-4 rounded-r-xl">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  Executive Summary
                </span>
                <p className="text-xs sm:text-sm text-gray-200">
                  {readingArticle.summary}
                </p>
              </div>

              {/* Sections */}
              {readingArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base font-bold text-white font-display border-b border-gray-800/80 pb-1.5">
                    {sec.heading}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}

              {/* Key Takeaways */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider block">
                  Core Scientific Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {readingArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800/80 bg-gray-900/50 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>blimic Field Guide</span>
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
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
