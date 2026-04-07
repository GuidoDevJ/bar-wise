import Skeleton from '@/components/ui/Skeleton';

export default function CoctelsLoading() {
  return <div className="p-4"><Skeleton variant="card" count={4} /></div>;
}
