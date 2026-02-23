'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  TrendingUp,
  Search,
  Lightbulb,
  Target,
  Zap,
} from 'lucide-react';

const AI_FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Personalized Recommendations',
    description: 'Get book suggestions tailored to your reading history and preferences',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find books with intelligent fuzzy matching and semantic understanding',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Trending & New Arrivals',
    description: 'Discover what\'s popular and newly added based on AI analysis',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Target,
    title: 'Similar Books Finder',
    description: 'AI finds books similar to ones you\'ve enjoyed',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Reading Insights',
    description: 'Track your reading patterns and get personalized insights',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Zap,
    title: 'Auto-Generated Summaries',
    description: 'AI creates book descriptions when they\'re missing',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
];

export function AIFeaturesTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    // Check if user has seen the tour
    const tourSeen = localStorage.getItem('ai-tour-seen');
    if (!tourSeen) {
      // Show tour after a brief delay
      setTimeout(() => {
        setIsOpen(true);
        setHasSeenTour(false);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('ai-tour-seen', 'true');
    setHasSeenTour(true);
  };

  const handleNext = () => {
    if (currentStep < AI_FEATURES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const currentFeature = AI_FEATURES[currentStep];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 ease-spring"
        title="View AI Features Tour"
      >
        <Sparkles className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">AI-Powered Features</h2>
                <p className="text-xs text-muted-foreground">
                  Discover intelligent tools to enhance your reading
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${currentFeature.bgColor} mb-4`}>
                <currentFeature.icon className={`h-8 w-8 ${currentFeature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {currentFeature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {AI_FEATURES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {currentStep === AI_FEATURES.length - 1 ? (
                    <>
                      Get Started
                      <Sparkles className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step counter */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              {currentStep + 1} of {AI_FEATURES.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
