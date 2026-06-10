import Skeleton from '@/components/ui/Skeleton';

export default function DrinksLoading() {
  return <div className="p-4"><Skeleton variant="card" count={4} /></div>;
}
