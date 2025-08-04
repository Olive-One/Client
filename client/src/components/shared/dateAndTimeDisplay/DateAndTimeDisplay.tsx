import React from 'react';
import { format } from 'date-fns';

interface DateTimeDisplayProps {
  dateTime: string;
  formatString?: string;
  className?: string;
}

export default function DateTimeDisplay({
  dateTime,
  formatString = 'MMM dd, yyyy',
  className = '',
}: DateTimeDisplayProps) {
  const formattedDate = format(new Date(dateTime), formatString);

  return (
    <span className={`text-foreground ${className}`}>
      {formattedDate}
    </span>
  );
}