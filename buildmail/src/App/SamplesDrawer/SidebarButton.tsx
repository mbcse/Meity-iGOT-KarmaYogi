import React from 'react';
import { Button } from '@mui/material';
import { resetDocument } from '../../documents/editor/EditorContext';
import getConfiguration, { asyncGetDocument } from '../../getConfiguration';

export default function SidebarButton({ href, children }: { href: string; children: JSX.Element | string }) {
  const handleClick = async () => {
    if (href.includes('#template')) {
      resetDocument(await asyncGetDocument(href));
    } else {
      resetDocument(await getConfiguration(href));
    }
  };

  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
