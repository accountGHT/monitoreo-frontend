// assets
import { IconKey, IconBrandChrome } from '@tabler/icons';

// constant
const icons = {
  IconBrandChrome,
  IconKey
};

// const PagesMonitoreoCamaras = Loadable(lazy(() => import('views/pages/MonitoreoCamaras')));
// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Principal',
  caption: 'Páginas Principales',
  type: 'group',
  children: [
    {
      id: 'pages-monitoreo-camaras',
      title: 'Monitoreo Cámaras',
      type: 'item',
      url: '/pages/monitoreo-camaras',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
      
    },
    {
      id: 'pages-central-comunicaciones',
      title: 'Central de comunicaciones',
      type: 'item',
      url: '/pages/central-comunicaciones',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'pages-distribucion-personal',
      title: 'Distribución del personal',
      type: 'item',
      url: '/pages/distribucion-personal',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    // {
    //   id: 'authentication',
    //   title: 'Authentication',
    //   type: 'collapse',
    //   icon: icons.IconKey,

    //   children: [
    //     {
    //       id: 'login',
    //       title: 'Login',
    //       type: 'item',
    //       url: '/pages/login/login',
    //       target: true
    //     },
    //     {
    //       id: 'register3',
    //       title: 'Register',
    //       type: 'item',
    //       url: '/pages/register/register3',
    //       target: true
    //     }
    //   ]
    // }
  ]
};

export default pages;
