import { styled } from '@mui/material/styles';
import {
  Button, TextField, Typography,
} from '@mui/material';

export const RoundedButton = styled(Button)(() => ({
  borderRadius: 10,
  width: '100%',
  boxShadow: 10,
}));

export const TextInput = styled(TextField)(() => ({
  boxShadow: 2,
  input: {
    color: 'black',
  },

}));

export const WhiteTypography = styled(Typography)(() => ({
  color: '#3C6435',
}));

export const GreenTypography = styled(Typography)(() => ({
  color: 'green',
}));
