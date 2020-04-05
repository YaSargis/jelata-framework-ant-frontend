import React from 'react';
import _ from 'lodash';

import { Layout, Icon, Divider, Typography, Row, Tooltip } from 'antd';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { set_favorits_menu } from 'src/redux/actions/user';

const { Header } = Layout;
const { Title } = Typography;
import { menu_creator } from 'src/libs/methods';

const enhance = compose(
  connect(
    state => ({
      favorits_menu: state.user.favorits_menu
    }),
    dispatch => ({
      set_favorits_menu: menu => dispatch(set_favorits_menu(menu))
    })
  ),
  withState('menu', 'changeMenu', []),
  withState('usermenu', 'changeUsermenu', []),
  withState('colorIcon', 'changeColorIcon', 'outlined'),
  withHandlers({
    menu_creator: menu_creator,
    handlerToggleFavorit: ({
      favorits_menu,
      set_favorits_menu,
      colorIcon,
      changeColorIcon
    }) => () => {
      let favoritesPages = favorits_menu,
        currentPage = location.pathname + location.search + location.hash;

      favoritesPages = favoritesPages || [];

      if (colorIcon === 'outlined') {
        if (currentPage !== favoritesPages.find(item => item === currentPage)) {
          favoritesPages.push({ path: currentPage, title: '' });
        }
        changeColorIcon('filled');
      } else {
        const pageIndex = favoritesPages.findIndex(item => item.path === currentPage),
          firstSlice = favoritesPages.slice(0, pageIndex),
          secondSlice = favoritesPages.slice(pageIndex + 1, favoritesPages.length);

        favoritesPages = [...firstSlice, ...secondSlice];
        changeColorIcon('outlined');
      }

      set_favorits_menu(favoritesPages);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { changeColorIcon, favorits_menu } = this.props;
      if (favorits_menu === null) favorits_menu = [];

      const currentPage = location.pathname + location.search + location.hash;
      const findedPage = favorits_menu.find(item => item.path === currentPage);
      if (currentPage === (findedPage ? findedPage.path : null)) {
        changeColorIcon('filled');
      }
    }
  })
);

const MyHeader = props => {
  const { children, extra, title, subtitle, className, handlerToggleFavorit, colorIcon } = props;
  return (
    <Header className={className || ''} style={{ background: '#fff', padding: 0 }}>
      <Row>
        <Divider style={{ margin: 0 }} />
        {extra || null}
        {title ? (
          <Title level={4} style={{ display: 'inline-block', marginRight: '10px' }}>
            {title}
          </Title>
        ) : null}
        {subtitle ? <span className='ant-page-header-title-view-sub-title'>{subtitle}</span> : null}
        {children || null}
        {!(location.pathname === '/home') ? (
          <Tooltip title='favorite'>
            <Icon
              type='star'
              className='iconInHeader'
              theme={colorIcon}
              style={{
                fontSize: '24px',
                float: 'right',
                margin: '20px 40px 20px 0',
                color: '#1890ff'
              }}
              onClick={() => handlerToggleFavorit()}
            />
          </Tooltip>
        ) : null}
      </Row>
    </Header>
  );
};

export default enhance(MyHeader);
