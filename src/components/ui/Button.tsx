import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800',
    outline: 'border border-stone-300 text-stone-900 hover:bg-stone-100',
    ghost: 'text-stone-600 hover:text-stone-900',
  };

  return (
    <button
      className={cn(
        'px-6 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
