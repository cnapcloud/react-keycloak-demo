interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
};

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <span
      className={`inline-block rounded-full border-current border-t-transparent animate-spin ${sizeClasses[size]}`}
      role="status"
      aria-label="loading"
    />
  );
}
