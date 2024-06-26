import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const PagesMonitoreoCamaras = Loadable(lazy(() => import('views/pages/monitoreo-camaras')));
const PagesCentralComunicaciones = Loadable(lazy(() => import('views/pages/central-comunicaciones')));
const PagesDistribucionPersonal = Loadable(lazy(() => import('views/pages/distribucion-personal')));


// settings routing
const SettingsVehicles = Loadable(lazy(() => import('views/settings/vehicles')));
const SettingsPersons = Loadable(lazy(() => import('views/settings/persons')));
const SettingsZonas = Loadable(lazy(() => import('views/settings/multi-table/Zonas')));
const SettingsTiposComunicacion = Loadable(lazy(() => import('views/settings/multi-table/TiposComunicacion')));
const SettingsTiposApoyo = Loadable(lazy(() => import('views/settings/multi-table/TiposComunicacion')));
const SettingsTiposIncidencia = Loadable(lazy(() => import('views/settings/multi-table/TiposIncidencia')));
const SettingsTiposPatrullaje = Loadable(lazy(() => import('views/settings/multi-table/TiposPatrullaje')));
const SettingsCamaras = Loadable(lazy(() => import('views/settings/multi-table/Camaras')));
const SettingsInstituciones = Loadable(lazy(() => import('views/settings/multi-table/Instituciones')));
const SettingsAreas = Loadable(lazy(() => import('views/settings/multi-table/Areas')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'pages',
      children: [
        {
          path: 'monitoreo-camaras',
          element: <PagesMonitoreoCamaras />
        },
        {
          path: 'central-comunicaciones',
          element: <PagesCentralComunicaciones />
        },
        {
          path: 'distribucion-personal',
          element: <PagesDistribucionPersonal />
        }
      ]
    },
    {
      path: 'configuraciones',
      children: [
        {
          path: 'vehiculos',
          element: <SettingsVehicles />
        },
        {
          path: 'personas',
          element: <SettingsPersons />
        },
        {
          path: 'otros',
          children: [
            {
              path: 'zonas',
              element: <SettingsZonas />
            },
            {
              path: 'tipos-comunicacion',
              element: <SettingsTiposComunicacion />
            },
            {
              path: 'tipos-apoyo',
              element: <SettingsTiposApoyo />
            },
            {
              path: 'tipos-incidencia',
              element: <SettingsTiposIncidencia />
            },
            {
              path: 'tipos-patrullaje',
              element: <SettingsTiposPatrullaje />
            },
            {
              path: 'camaras',
              element: <SettingsCamaras />
            },
            {
              path: 'instituciones',
              element: <SettingsInstituciones />
            },
            {
                path: 'areas',
                element: <SettingsAreas />
            }
          ]
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'tabler-icons',
          element: <UtilsTablerIcons />
        }
      ]
    },
    {
      path: 'icons',
      children: [
        {
          path: 'material-icons',
          element: <UtilsMaterialIcons />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
