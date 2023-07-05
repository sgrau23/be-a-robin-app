import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Grid, Box, TextField, InputAdornment,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function ListFilter({
  data, checked, setChecked,
}) {
  const [filterText, setFilterText] = useState('');
  const [filterdData, setFilteredData] = useState(data);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  useEffect(() => {
    setFilteredData(
      _.filter(data, (intolerance) => intolerance.name.toLowerCase().includes(filterText.toLowerCase())),
    );
  }, [filterText]);

  return (
    <Grid
      container
      sx={{
        padding: '10px',
      }}
      columns={{
        xs: 12, sm: 12, md: 12, lg: 12,
      }}
      spacing={{
        xs: 2, sm: 2, md: 2, lg: 2,
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <TextField
          id="filter"
          variant="outlined"
          onChange={(e) => setFilterText(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: 10,
              backgroundColor: '#e6e6e6',
              height: '40px',
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <List
          sx={{
            width: '100%',
            // bgcolor: 'background.paper',
          }}
        >
          {
          filterdData.map((element) => (
            <>
              <ListItem
                key={element.id}
                disablePadding
              >
                <ListItemButton key={`itemButton${element.id}`} role={undefined} onClick={handleToggle(element.id)} dense>
                  <ListItemIcon key={`itemIcon${element.id}`}>
                    <Checkbox
                      key={`itemCheckBox${element.id}`}
                      edge="start"
                      checked={checked.indexOf(element.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': element.id }}
                    />
                  </ListItemIcon>
                  <ListItemText id={`itemText${element.id}`} primary={element.name} />
                </ListItemButton>
              </ListItem>
              <Divider key={`itemDivider${element.id}`} />
            </>
          ))
        }
        </List>

      </Grid>
    </Grid>
  );
}
