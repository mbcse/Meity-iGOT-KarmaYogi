import React from 'react';
import { Box, Button, Divider, Drawer, Stack, Typography } from '@mui/material';
import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import SidebarButton from './SidebarButton';
import { resetDocument } from '../../documents/editor/EditorContext';
import getConfiguration, { asyncGetDocument } from '../../getConfiguration';


export const SAMPLES_DRAWER_WIDTH = 240;

interface Template {
  name: string;
}

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const [templates, setTemplates] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_HOST}/templates/list/nocode`)
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
      });
  }, []);

  const handleCreateClick = async () => {
    resetDocument(await getConfiguration('#'));
    window.location.hash = ''; 
  };


  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            Buildmail
          </Typography>

         <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateClick}  // Attach the handleCreateClick function here
            sx={{ mb: 2 }}
          >
            Create
          </Button>

          <Stack alignItems="flex-start">
        
            {templates.map((template: Template, index: number) => (
              <SidebarButton key={index} href={`#template/${template.name}`}>
                {template.name}
              </SidebarButton>
            ))}
          </Stack>

          <Divider />
        </Stack>
      </Stack>
    </Drawer>
  );
}
