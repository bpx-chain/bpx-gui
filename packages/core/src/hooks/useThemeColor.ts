import { usePrefs } from '@bpx-chain/api-react';
import { Theme } from '@mui/material';

export default function useThemeColor(theme: Theme, variant?: string): string {
  const [themeColor] = usePrefs<string>('themeColor', 'default');
  return theme.palette.colors[themeColor || 'neutral'][variant || 'main'];
}
