import styles from './Button.module.scss';

export type ButtonProps = {
   type?: 'button' | 'submit' | 'reset';
   variant?: 'primary' | 'secondary' | 'icon-button';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
   children,
   onClick,
   type = 'button',
   variant = 'primary',
   disabled = false,
   className = '',
   title = '',
   ...rest
}: ButtonProps) {
   if (variant === 'icon-button') {
      className = `${styles.button} ${className} ${styles.iconButton}`;
   } else if (variant === 'secondary') {
      className = `${styles.button} ${className} ${styles.secondary}`;
   } else {
      className = `${styles.button} ${className}`;
   }

   return (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         className={className}
         title={title}
         aria-label={rest['aria-label'] ?? 'button'}
         {...rest}
      >
         {children}
      </button>
   );
}
