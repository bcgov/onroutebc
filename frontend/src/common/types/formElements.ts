export interface CustomInputHTMLAttributes extends React.InputHTMLAttributes<HTMLInputElement> {
  "data-testid"?: string;
}

export interface CustomSelectDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-testid"?: string;
}