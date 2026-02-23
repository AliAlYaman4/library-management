'use client';

import { useEffect, useState } from 'react';
import { AIFeatureExplainer } from '@/components/AIFeatureExplainer';
import { Sparkles, Loader2, Flame, Trophy, Compass, Zap, Heart } from 'lucide-react';

interface Insight {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, any> = {
  Flame,
  Trophy,
  Compass,
  Zap,
  Heart,
  Sparkles,
};

const colorMap: Record<string, string> = {
  primary: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  violet: 'text-violet-500 bg-violet-500/10',
  sky: 'text-sky-500 bg-sky-500/10',
  pink: 'text-pink-500 bg-pink-500/10',
};

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/ai/insights');
        if (res.ok) {
          const data = await res.json();
          setInsights(data.insights || []);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Analyzing your reading...</span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-card overflow-hidden">
      <div className="border-b border-border bg-primary/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Reading Insights</h3>
          <AIFeatureExplainer feature="insights" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Personalized insights based on your reading habits
        </p>
      </div>
      <div className="p-5 space-y-3">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.icon] || Sparkles;
          const colorClass = colorMap[insight.color] || colorMap.primary;

          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/25 hover:bg-accent transition-all"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {insight.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
