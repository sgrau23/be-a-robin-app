import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { breadcumbsMapping } from '../lib/breadcumbs';

export function BreadCrumb({ paths }) {
  const added = [];
  const breadcrumbs = [];
  paths.forEach((path) => {
    if (!added.includes(path)) {
      added.push(path);
      breadcrumbs.push([
        <Link underline="hover" key="path" href={(path !== '' ? added.join('/') : '/')} color="primary">
          {(breadcumbsMapping[path] ? breadcumbsMapping[path] : path)}
        </Link>,
      ]);
    }
  });

  return (
    <Stack spacing={2}>
      <Breadcrumbs
        maxItems={2}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
