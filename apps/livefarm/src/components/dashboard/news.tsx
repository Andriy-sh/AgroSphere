'use client';

import React from 'react';
import { cn, Icon } from '@@agrosphere/shared';
import { SplitCard } from '@@agrosphere/shared';
import Image from 'next/image';

interface NewsArticle {
  id: string;
  title: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

interface NewsProps {
  className?: string;
  articles?: NewsArticle[];
  onArticleClick?: (articleId: string) => void;
}

const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'How to effectively manage crop nutrition in August',
    date: 'August 8, 2025',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Exporters increase demand for corn what it means for farmers',
    date: 'August 7, 2025',
    readTime: '7 min read',
  },
  {
    id: '3',
    title: 'Grain prices in July: analysis and outlook for the coming weeks',
    date: 'July 28, 2025',
    readTime: '6 min read',
  },
];

export const News: React.FC<NewsProps> = ({
  className,
  articles = [],
  onArticleClick,
}) => {
  const displayedArticles = articles.length ? articles : mockNewsArticles;

  return (
    <SplitCard
      className={cn('max-h-[370px] text-basic-black', className)}
      topContent={
        <div>
          <h2 className="text-base font-semibold text-basic-black">News</h2>
        </div>
      }
      bottomContent={
        <div className="space-y-0 divide-y divide-basic-white">
          {displayedArticles.map((article, index) => (
            <div
              key={article.id}
              className={`flex items-center gap-4 ${
                index === 0
                  ? 'pb-4'
                  : index === displayedArticles.length - 1
                  ? 'pt-4'
                  : 'py-4'
              }`}
            >
              <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-basic-gray">
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    width={80}
                    height={64}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-basic-black mb-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-basic-gray">
                  {article.date} <span className="px-px">•</span>{' '}
                  {article.readTime}
                </p>
              </div>

              <Icon
                onClick={() => onArticleClick?.(article.id)}
                icon="open_in_new"
                className=" text-basic-black hover:text-basic-black/80 hover:bg-basic-black/10 rounded-md p-1"
              />
            </div>
          ))}
        </div>
      }
    />
  );
};
