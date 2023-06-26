import React from 'react';
import {
  Typography,
} from '@mui/material';

export function ChatMessage({ data }) {
  return (
    <Typography
      // noWrap
      style={{
        wordWrap: 'break-word',
      }}
      sx={{
        width: 'auto',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 1,
        boxShadow: 5,
      }}
    >
      {data.message}
    </Typography>
  );
}
