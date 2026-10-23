import type { ReactNode } from 'react';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@devvy-ui/react';

/** One shared composition of DEVVY primitives for the landing examples. */
export function LandingCard({
  category,
  title,
  description,
  footer,
  className = '',
  children,
  label,
}: {
  category: string;
  title: string;
  description: string;
  footer?: ReactNode;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <Card className={`landing-card ${className}`} aria-label={label}>
      <CardHeader>
        <Badge tone="neutral">{category}</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
