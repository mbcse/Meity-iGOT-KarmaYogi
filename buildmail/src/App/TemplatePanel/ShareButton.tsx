import React, { useState, useCallback, useEffect,useMemo } from 'react';
import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip, Card, TextField, Button } from '@mui/material';
import { useDocument } from '../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function ShareButton() {
  const document = useDocument();
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSaveAs, setIsSaveAs] = useState(false);
  const [showSaveCurrent, setShowSaveCurrent] = useState(true);
    const code = useMemo(() => renderToStaticMarkup(document, { rootBlockId: 'root' }), [document]);

  // Extract and decode the template name from URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const nameFromUrl = hash ? decodeURIComponent(hash.split('/')[1]) : '';
      setTemplateName(nameFromUrl || '');
      setShowSaveCurrent(!!nameFromUrl);
    };
  
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
  
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const onClick = (saveAs: boolean) => {
    setIsSaveAs(saveAs);
    if (saveAs) {
      setOpen(true);
    } else {
      onSubmit();
    }
  };

  const onSubmit = useCallback(async () => {
    const plainJSON = JSON.stringify(document, null, '  ');

    const url = isSaveAs 
      ? 'http://localhost:3010/templates/upload/nocode'  
      : 'http://localhost:3010/templates/update/nocode';

    try {
      const response = await fetch(url, {
        method: isSaveAs ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plainJSON, code, templateName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage(isSaveAs ? 'Template saved as new file.' : 'Template updated successfully.');
      } else {
        const errorData = await response.json();
        console.error('Failed to upload template:', errorData);
        setMessage(`Failed to save the template: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while saving the template.');
    } finally {
      setOpen(false);
    }
  }, [document, templateName, isSaveAs]);

  const onClose = () => {
    setMessage(null);
  };

  return (
    <>
        {open && (
        <Card
          style={{
            position: 'absolute',
            top: '200%',
            left: '60%',
            transform: 'translate(-5%, -15%)',
            padding: 20,
            zIndex: 1000,
          }}
        >
          <TextField
            label="New Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained" color="primary" style={{ marginTop: 10 }} fullWidth>
            Save 
          </Button>
        </Card>
      )}

      {showSaveCurrent && (
        <Button 
          variant="contained"
            color="primary"
        onClick={() => onClick(false)}>
            Save Changes
        </Button>
      )}

      <Button
           variant="contained"
            color="primary"
      onClick={() => onClick(true)}>
          Save As
      </Button>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        onClose={onClose}
        message={message}
      />
    </>
  );
}
