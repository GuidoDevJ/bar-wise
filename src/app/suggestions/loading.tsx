import Skeleton from '@/components/ui/Skeleton';

export default function SuggestionsLoading() {
  return <div className="p-4"><Skeleton variant="card" count={3} /></div>;
}
