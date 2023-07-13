import React from 'react';
import {
  Autocomplete, TextField, MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';

export function MultiSelector({
  id, text, options, onHandleChange, selectedOptions,
}) {
  // Translations
  const { t } = useTranslation();
  return (
    <Autocomplete
      sx={{ width: '100%' }}
      multiple
      id={id}
      options={options}
      getOptionLabel={(option) => option}
      defaultValue={selectedOptions}
      onChange={onHandleChange}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <MenuItem
          key={option}
          value={option}
          sx={{ justifyContent: 'space-between' }}
          {...props}
        >
          {option}
          {selected ? <CheckIcon color="primary" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={text}
          placeholder={t('Escribe...')}
          // InputProps={{
          //   sx: {
          //     margin: '3px',
          //   },
          // }}
        />
      )}
    />

  );
}
