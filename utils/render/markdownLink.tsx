// components/CustomComponents.tsx

import { Components } from 'react-markdown';
import { DetailedHTMLProps, AnchorHTMLAttributes, ReactNode } from 'react';

interface AnchorProps extends Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'ref'> {
    children: ReactNode;
}


export const customComponents: Components = {
  a: ({ children, ...props }: AnchorProps) => (
    <a {...props} className="markdown-link">
      {children}
    </a>
  ),
};
