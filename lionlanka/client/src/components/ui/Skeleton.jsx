import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Base theme for dark mode
export const BaseSkeletonTheme = ({ children }) => (
  <SkeletonTheme baseColor="#1a1635" highlightColor="#2a2450">
    {children}
  </SkeletonTheme>
);

export const ArticleCardSkeleton = () => {
  return (
    <BaseSkeletonTheme>
      <div className="card flex flex-col h-full border border-white/5 rounded-2xl overflow-hidden">
        <div className="h-48 w-full">
          <Skeleton height="100%" borderRadius={0} />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <Skeleton count={2} height={20} className="mb-2" />
          </div>
          <div className="mb-6 flex-1">
            <Skeleton count={3} height={12} className="mb-1" />
          </div>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-3">
              <Skeleton width={80} height={12} />
              <Skeleton width={80} height={12} />
            </div>
            <div className="h-px w-full bg-white/5 mb-3"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton circle width={24} height={24} />
                <Skeleton width={100} height={14} />
              </div>
              <div className="flex gap-3">
                <Skeleton width={30} height={14} />
                <Skeleton width={30} height={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSkeletonTheme>
  );
};

export const PlaceCardSkeleton = () => {
  return (
    <BaseSkeletonTheme>
      <div className="w-full h-80 rounded-2xl overflow-hidden relative">
        <Skeleton height="100%" borderRadius="1rem" />
        <div className="absolute bottom-6 left-6 right-6">
          <Skeleton width={80} height={24} className="mb-4 rounded-full" />
          <Skeleton width="70%" height={28} className="mb-2" />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
    </BaseSkeletonTheme>
  );
};

export const ArticleDetailSkeleton = () => {
  return (
    <BaseSkeletonTheme>
      <div className="w-full">
        {/* Hero */}
        <div className="w-full h-[60vh] min-h-[400px] mb-12">
          <Skeleton height="100%" borderRadius={0} />
        </div>
        
        {/* Content Area */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <Skeleton width={100} height={30} className="mb-6 rounded-full" />
              <Skeleton count={3} height={40} className="mb-4" />
              <div className="flex items-center gap-4 mb-10">
                <Skeleton circle width={48} height={48} />
                <div>
                  <Skeleton width={120} height={20} className="mb-1" />
                  <Skeleton width={180} height={14} />
                </div>
              </div>
              
              <div className="space-y-6 mt-12">
                <Skeleton height={20} count={6} />
                <Skeleton height={200} className="my-8" />
                <Skeleton height={20} count={5} />
                <Skeleton height={20} count={7} />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-8 hidden lg:block">
              <div className="p-6 rounded-2xl bg-card border border-white/5">
                <Skeleton height={24} width={150} className="mb-6" />
                <div className="space-y-4">
                  <Skeleton height={40} />
                  <Skeleton height={40} />
                  <Skeleton height={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSkeletonTheme>
  );
};

export const GenericSkeleton = ({ count = 1, height = 20, circle = false, className = "" }) => (
  <BaseSkeletonTheme>
    <Skeleton count={count} height={height} circle={circle} className={className} />
  </BaseSkeletonTheme>
);
