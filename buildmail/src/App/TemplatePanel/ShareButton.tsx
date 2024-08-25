import React, { useState, useCallback, useEffect } from 'react';
import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip, Card, TextField, Button } from '@mui/material';
import { useDocument } from '../../documents/editor/EditorContext';

export default function ShareButton() {
  const document = useDocument();
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isSaveAs, setIsSaveAs] = useState(false);
  const [showSaveCurrent, setShowSaveCurrent] = useState(true); // State to control visibility of the "Save current template" button

  // Extract and decode the template name from URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const nameFromUrl = hash ? decodeURIComponent(hash.split('/')[1]) : '';
      setTemplateName(nameFromUrl || '');
      setShowSaveCurrent(!!nameFromUrl);
    };
  
    // Initial hash check
    handleHashChange();
  
    // Add hash change listener
    window.addEventListener('hashchange', handleHashChange);
  
    // Cleanup listener on component unmount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const onClick = (saveAs: boolean) => {
    setIsSaveAs(saveAs);
    if (saveAs) {
      setOpen(true); // Show the input field for "Save As"
    } else {
      onSubmit(); // Directly save using the existing template name from URL
    }
  };

  const onSubmit = useCallback(async () => {
    const plainJSON = JSON.stringify(document, null, '  ');

    const url = isSaveAs 
      ? 'http://localhost:3010/templates/upload/nocode' 
      : 'http://localhost:3010/templates/update/nocode';

    try {
      const response = await fetch(url, {
        method: isSaveAs ? 'POST' : 'PUT', // POST for new template, PUT for updating existing
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plainJSON, templateName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage(isSaveAs ? 'Template saved as new file.' : 'Template updated successfully.');
      } else {
        console.error('Failed to upload template:', response.statusText);
        setMessage('Failed to save the template.');
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
            Save As
          </Button>
        </Card>
      )}

      {/* Show "Save current template" only if templateName is present */}
      {showSaveCurrent && (
        <IconButton onClick={() => onClick(false)}>
          <Tooltip title="Save current template">
            <IosShareOutlined fontSize="small" />
          </Tooltip>
        </IconButton>
      )}

      <IconButton onClick={() => onClick(true)}>
        <Tooltip title="Save As">
          <IosShareOutlined fontSize="small" />
        </Tooltip>
      </IconButton>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message !== null}
        onClose={onClose}
        message={message}
      />
    </>
  );
}
