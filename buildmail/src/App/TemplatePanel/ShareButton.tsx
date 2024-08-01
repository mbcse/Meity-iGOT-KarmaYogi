import React, { useState, useCallback } from 'react';
import { IosShareOutlined } from '@mui/icons-material';
import { IconButton, Snackbar, Tooltip, Card, TextField, Button } from '@mui/material';
import { useDocument } from '../../documents/editor/EditorContext';

export default function ShareButton() {
  const document = useDocument();
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const onClick = () => {
    setOpen(true);
  };

  const onSubmit = useCallback(async () => {
    const plainJSON = JSON.stringify(document, null, '  ');

    try {
      const response = await fetch('http://localhost:3010/templates/upload/nocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plainJSON: plainJSON, templateName: templateName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMessage('The URL was updated. Copy it to share your current template.');
      } else {
        console.error('Failed to upload template:', response.statusText);
        setMessage('Failed to upload template.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while uploading the template.');
    } finally {
      setOpen(false);
    }
  }, [document, templateName]);

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
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained" color="primary" style={{ marginTop: 10 }} fullWidth>
            Submit
          </Button>
        </Card>
      )}
      <IconButton onClick={onClick}>
        <Tooltip title="Save current template">
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
