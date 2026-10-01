import { FeedSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-8">
      <FeedSkeleton />
    </main>
  );
}
