// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| settings MENU ITEMS ||============================== //

const settings = {
  id: 'settings',
  title: 'configuraciones',
  type: 'group',
  children: [
    {
      id: 'setting-vehiculos',
      title: 'Vehículos',
      type: 'item',
      url: '/configuraciones/vehiculos',
      icon: icons.IconTypography,
      breadcrumbs: false
    },
    {
      id: 'setting-personas',
      title: 'Personas',
      type: 'item',
      url: '/configuraciones/personas',
      icon: icons.IconPalette,
      breadcrumbs: false
    },
    {
      id: 'icons',
      title: 'Otros',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default settings;
