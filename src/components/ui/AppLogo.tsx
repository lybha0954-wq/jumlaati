import { Rocket } from 'lucide-react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export default function AppLogo({ size = 40, className = '' }: AppLogoProps) {
  return (
    <div
      className={`rounded-xl bg-accent flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Rocket size={size * 0.55} className="text-white" strokeWidth={2.5} />
    </div>
  );
}
