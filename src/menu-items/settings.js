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
      id: 'setting-others',
      title: 'Otros',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'setting-zonas',
          title: 'ZONAS',
          type: 'item',
          url: '/configuraciones/otros/zonas',
          breadcrumbs: false
        },
        {
          id: 'setting-tipos-comunicacion',
          title: 'TIPOS DE COMUNICACIÓN',
          type: 'item',
          url: '/configuraciones/otros/tipos-comunicacion',
          breadcrumbs: false
        },
        {
          id: 'setting-tipos-incidencia',
          title: 'TIPOS DE INCIDENCIA',
          type: 'item',
          url: '/configuraciones/otros/tipos-incidencia',
          breadcrumbs: false
        },
        {
          id: 'setting-tipos-patrullaje',
          title: 'TIPOS DE PATRULLAJE',
          type: 'item',
          url: '/configuraciones/otros/tipos-patrullaje',
          breadcrumbs: false
        },
        {
          id: 'setting-camaras',
          title: 'CÁMARAS',
          type: 'item',
          url: '/configuraciones/otros/camaras',
          breadcrumbs: false
        }
        // ,{
        //   id: 'material-icons',
        //   title: 'Material Icons',
        //   type: 'item',
        //   external: true,
        //   target: '_blank',
        //   url: 'https://mui.com/material-ui/material-icons/',
        //   breadcrumbs: false
        // }
      ]
    }
  ]
};

export default settings;
