export const Button = ({ children, onClick, ...props }: any) => (
  <button onClick={onClick} {...props}>{children}</button>
);

export const Progress = ({ value, ...props }: any) => (
  <div role="progressbar" aria-valuenow={value} {...props} />
);

export const Timer = () => (
  <span data-testid="timer-icon">⏲️</span>
); 