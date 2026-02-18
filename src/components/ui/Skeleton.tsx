import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
  count?: number;
}

const Skeleton = ({ className, variant = 'text', count = 1 }: SkeletonProps) => {
  const baseClass = 'animate-pulse bg-secondary-100 rounded-md';
  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-[120px] w-full',
    circle: 'h-8 w-8 rounded-full',
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={clsx(baseClass, variantClasses[variant], className)} />
      ))}
    </div>
  );
};

export default Skeleton;
