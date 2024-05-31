import React from 'react';
import { ReactComponent as DashboardIcon } from './dashboard-02.svg';

const IconWrapper = ({ Icon, style }) => (
  <Icon style={style} />
);

const icons = {
  DashboardIcon
};

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: (props) => (
        <IconWrapper
          Icon={icons.DashboardIcon}
          style={{
            width: '24px', // Reducir el tamaño del icono
            height: '24px',
            marginRight: '8px' // Agregar espacio a la derecha del icono
          }}
          {...props}
        />
      ),
      breadcrumbs: false
    }
  ]
};

export default dashboard;
