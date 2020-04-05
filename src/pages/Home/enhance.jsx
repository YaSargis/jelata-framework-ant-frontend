import { connect } from 'react-redux';
import { set_favorits_menu } from 'src/redux/actions/user'
import { compose, withState, withHandlers, lifecycle } from 'recompose';

const enhance = compose(
  connect(
    state => ({
      isLogin: state.user.isLogin,
      custom_menu: state.user.custom_menu,
      favorits_menu: state.user.favorits_menu
    }),
    dispatch => ({
      set_favorits_menu: (menu) => dispatch(set_favorits_menu(menu))
    })
  ),
  withHandlers({
    handlerDeleteButton: ({ favorits_menu, set_favorits_menu }) => (it) => {
      let favoritesPages = favorits_menu;
      
      const pageIndex = favoritesPages.findIndex((item) => item === it);
      const firstSlice = favoritesPages.slice(0, pageIndex);
      const secondSlice = favoritesPages.slice(pageIndex + 1, favoritesPages.length);
      favoritesPages = [...firstSlice, ...secondSlice];

      set_favorits_menu(favoritesPages);
    }
  }),
)

export default enhance;