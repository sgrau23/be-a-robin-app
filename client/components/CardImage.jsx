import React from 'react';
import {
  Container,
} from '@mui/material';

export function CardImage({ url }) {
  return (
    <Container
      fixed
      sx={{
        backgroundColor: 'transparent',
        marginTop: 3,
      }}
    >
      <img
        alt=""
        // src={`${url}?fit=crop&auto=format`}
        // srcSet={`${url}?fit=crop&auto=format&dpr=3 2x`}
        // src={`data:image/png;base64,${url}`}
        // srcSet={`data:image/png;base64,${url}`}
        src={url}
        srcSet={url}
        loading="lazy"
        style={{ height: 'auto', width: '100%', borderRadius: '10%' }}
      />
    </Container>
  );
}
