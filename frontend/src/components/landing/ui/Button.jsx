import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900',
  secondary:
    'bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-200',
  ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
