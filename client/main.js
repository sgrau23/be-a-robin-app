import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import i18nInitialized from './lib/i18n';
import { App } from './App';

// const cssVar = (name, value) => {
//   let _name = name;
//   if (_name.substr(0, 2) !== '--') {
//     _name = `--${name}`;
//   }
//   if (value) {
//     document.documentElement.style.setProperty(_name, value);
//   }
//   return getComputedStyle(document.documentElement).getPropertyValue(_name);
// };

// global.css = {
//   background: cssVar('background'),
//   foreground: cssVar('foreground'),
//   linkground: cssVar('linkground'),
// };

Meteor.startup(async () => {
  // Initialize translation method
  await i18nInitialized;
  // Renderize app
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(
    <App />,
  );
});
