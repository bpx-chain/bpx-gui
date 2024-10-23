import { Trans, t } from '@lingui/macro';
import { Translate, ExpandMore } from '@mui/icons-material';
import { Divider, Menu, MenuItem } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { useToggle } from 'react-use';

import useLocale from '../../hooks/useLocale';
import Button from '../Button';
import { LocaleContext } from '../LocaleProvider';

export default function LocaleToggle(props) {
  const { ...rest } = props;
  const { locales } = useContext(LocaleContext);
  const [currentLocale, setLocale] = useLocale();
  const [open, toggleOpen] = useToggle(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    toggleOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
    toggleOpen();
  };

  function handleSelect(locale: string) {
    setLocale(locale);
    toggleOpen();
  }

  const localeData = useMemo(() => locales.find((item) => item.locale === currentLocale), [currentLocale, locales]);

  const currentLocaleLabel = localeData?.label ?? t`Unknown`;

  return (
    <>
      <Button
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<Translate />}
        endIcon={<ExpandMore />}
        data-testid="LocaleToggle-dropdown"
        {...rest}
      >
        {currentLocaleLabel}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        {locales.map((item) => (
          <MenuItem
            key={item.locale}
            onClick={() => handleSelect(item.locale)}
            selected={item.locale === currentLocale}
            data-testid={`LocaleToggle-locale-${item.locale}`}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
