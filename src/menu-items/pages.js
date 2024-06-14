// assets
import { IconKey, IconBrandChrome } from '@tabler/icons';
import { ReactComponent as IncidenciasIcon } from './central-telf-02.svg';

const IconWrapper = ({ Icon, style }) => (
  <Icon style={style} />
);

// constant
const icons = {
  IconBrandChrome,
  IconKey,
  IncidenciasIcon
};

// const PagesMonitoreoCamaras = Loadable(lazy(() => import('views/pages/MonitoreoCamaras')));
// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Incidencias',
  caption: 'Registro y seguimiento de incidencias',
  type: 'group',
  children: [
    {
      id: 'pages-central-comunicaciones',
      title: 'Registro de incidencias',
      type: 'item',
      url: '/pages/central-comunicaciones',
      icon: (props) => (
        <IconWrapper
          Icon={icons.IncidenciasIcon}
          style={{
            width: '24px', // Reducir el tamaño del icono
            height: '24px',
            marginRight: '8px' // Agregar espacio a la derecha del icono
          }}
          {...props}
        />
      ),
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
