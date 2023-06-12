import { useState, useEffect } from 'react';

export const getPreviousPath = (path) => {
  const str = `${path.substr(path.lastIndexOf('/') + 1)}$`;
  if (str === '$') return '/';
  return path.replace(new RegExp(str), '');
};
