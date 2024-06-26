/* eslint-disable no-unused-vars */

// assets
import { IconAccessPoint, IconCamera, IconUsers, IconCameraPlus, IconActivityHeartbeat, IconZoomIn, IconAppWindow, IconSos, IconSquare } from '@tabler/icons';
import { ReactComponent as canalesIcon } from './canales-02.svg';
import { ReactComponent as distribucionPersonalIcon } from './distrib-pers-02.svg';
import { ReactComponent as ISOLOGO } from './ISOLOGO STP-02.svg';
import { ReactComponent as PatrullajeIcon } from './patrullaje-02.svg';
import { ReactComponent as PersonasIcon } from './Personas-02.svg';
import { ReactComponent as TiposIncideciaIcon } from './tiposincidencia-02.svg';
import { ReactComponent as VehiculosIcon } from './Vehiculos-02.svg';
import { ReactComponent as ZonasIcon } from './zonas-02.svg';
import { loadFromLocalStorage } from 'utils/localStorage';

const IconWrapper = ({ Icon, style }) => (
  <Icon style={style} />
);

// constant
const icons = {
  VehiculosIcon,
  PersonasIcon,
  canalesIcon,
  ZonasIcon,
  TiposIncideciaIcon,
  PatrullajeIcon,
  distribucionPersonalIcon,
  IconCamera,
  IconUsers,
  IconCameraPlus,
  IconZoomIn,
  IconAccessPoint,
  IconActivityHeartbeat,
  IconAppWindow,
  IconSos,
  IconSquare
};

const userLocalStorage = loadFromLocalStorage('user');

let settings;

// ==============================|| settings MENU ITEMS ||============================== //

if (userLocalStorage && userLocalStorage.id) {

  settings = {
    id: 'settings',
    title: 'Administración',
    type: 'group',
    children: [
      {
        id: 'setting-vehiculos',
        title: 'Vehículos',
        type: 'item',
        url: '/configuraciones/vehiculos',
        icon: (props) => (
          <IconWrapper
            Icon={icons.VehiculosIcon}
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
      /*
      {
        id: 'setting-camaras',
        title: 'Cámaras',
        type: 'collapse',
        url: '/configuraciones/otros/camaras',
        breadcrumbs: false,
        icon: icons.IconAccessPoint,
        children: [
          {
            id: 'setting-camaras2',
            title: 'Mantenedor Cámaras',
            type: 'item',
            url: '/configuraciones/otros/camaras',
            icon: icons.IconAppWindow,
            breadcrumbs: false

          },
          {
            id: 'pages-monitoreo-camaras',
            title: 'Monitoreo Cámaras',
            type: 'item',
            url: '/pages/monitoreo-camaras',
            icon: icons.IconActivityHeartbeat,
            breadcrumbs: false

          },
        ]
      },
      */
      {
        id: 'setting-personas',
        title: 'Personas',
        type: 'collapse',
        url: '/configuraciones/personas',
        icon: icons.IconUsers,
        breadcrumbs: false,
        children: [
          {
            id: 'setting-personas2',
            title: 'Mantenedor Personas',
            type: 'item',
            url: '/configuraciones/personas',
            icon: icons.IconUsers,
            breadcrumbs: false

          },
          {
            id: 'pages-distribucion-personal',
            title: 'Distribución del personal',
            type: 'item',
            url: '/pages/distribucion-personal',
            icon: (props) => (
              <IconWrapper
                Icon={icons.distribucionPersonalIcon}
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

        ]
      },

      {
        id: 'setting-zonas',
        title: 'Zonas',
        type: 'item',
        url: '/configuraciones/otros/zonas',
        breadcrumbs: false,
        icon: (props) => (
          <IconWrapper
            Icon={icons.ZonasIcon}
            style={{
              width: '24px', // Reducir el tamaño del icono
              height: '24px',
              marginRight: '8px' // Agregar espacio a la derecha del icono
            }}
            {...props}
          />
        ),
      },
      {
        id: 'setting-tipos-comunicacion',
        title: 'Canales',
        type: 'item',
        url: '/configuraciones/otros/tipos-comunicacion',
        breadcrumbs: false,
        icon: (props) => (
          <IconWrapper
            Icon={icons.canalesIcon}
            style={{
              width: '24px', // Reducir el tamaño del icono
              height: '24px',
              marginRight: '8px' // Agregar espacio a la derecha del icono
            }}
            {...props}
          />
        ),
      },
      {
        id: 'setting-tipos-incidencia',
        title: 'Tipos de Incidencia',
        type: 'collapse', // Cambiado a 'collapse' para que pueda tener hijos
        url: '/configuraciones/otros/tipos-incidencia',
        breadcrumbs: false,
        icon: (props) => (
          <IconWrapper
            Icon={icons.TiposIncideciaIcon}
            style={{
              width: '24px',
              height: '24px',
              marginRight: '8px'
            }}
            {...props}
          />
        ),
        children: [
          {
            id: 'setting-tipos-incidencia2',
            title: 'Mantenedor Tipos de Incidencia',
            type: 'item',
            url: '/configuraciones/otros/tipos-incidencia',
            breadcrumbs: false,
            icon: (props) => (
              <IconWrapper
                Icon={icons.TiposIncideciaIcon}
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '8px'
                }}
                {...props}
              />
            )
          },
          {
            id: 'setting-instituciones',
            title: 'Instituciones',
            type: 'item',
            url: '/configuraciones/otros/instituciones',
            breadcrumbs: false,
            icon: (props) => (
              <IconWrapper
                Icon={icons.IconSos}
                style={{
                  width: '30px',
                  height: '30px',
                  marginRight: '8px'
                }}
                {...props}
              />
            )
          },
          {
            id: 'setting-areas',
            title: 'Áreas',
            type: 'item',
            url: '/configuraciones/otros/areas',
            breadcrumbs: false,
            icon: (props) => (
              <IconWrapper
                Icon={icons.IconSquare}
                style={{
                  width: '30px',
                  height: '30px',
                  marginRight: '8px'
                }}
                {...props}
              />
            )
          }
        ]
      },
      {
        id: 'setting-tipos-patrullaje',
        title: 'Tipos de patrullaje',
        type: 'item',
        url: '/configuraciones/otros/tipos-patrullaje',
        breadcrumbs: false,
        icon: (props) => (
          <IconWrapper
            Icon={icons.PatrullajeIcon}
            style={{
              width: '30px', // Reducir el tamaño del icono
              height: '30px',
              marginRight: '8px' // Agregar espacio a la derecha del icono
            }}
            {...props}
          />
        ),
      },
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
  };
} else {
  settings = {
    id: 'settings',
    title: 'Invitado',
    type: 'group',
    children: []
  };
}

export default settings;
