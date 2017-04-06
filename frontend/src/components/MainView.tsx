import { connect } from 'react-redux';
import * as React from 'react';

import {getAlbum} from '../modules/album';
import AlbumView from './AlbumView';
import PictureView from './PictureView';
import Loading from './Loading';
import { State } from '../modules';


interface MainViewStateProps {
  mainView: string;
  path: string;
}
interface MainViewDispatchProps {
  getAlbum: typeof getAlbum;
}
interface MainViewOwnProps {}
type MainViewProps = MainViewStateProps & MainViewDispatchProps & MainViewOwnProps;
interface MainViewState {}


class MainView extends React.Component<MainViewProps, MainViewState> {
  render() {
    const { mainView } = this.props;

    switch (mainView) {
      case 'album':
        return <AlbumView />;
      case 'picture':
        return <PictureView />;
      default:
        return <Loading />;
    }
  }

  componentWillMount() {
    this.props.getAlbum(this.props.path);
  }

  componentWillReceiveProps(nextProps: MainViewProps) {
    if (nextProps.path !== this.props.path) {
      this.props.getAlbum(nextProps.path);
    }
  }
}


const mapStateToProps = (state: State) => ({
  mainView: state.mainView,
  path: state.routing.locationBeforeTransitions.pathname
});

const mapDispatchToProps = { getAlbum };


export default connect<MainViewStateProps, MainViewDispatchProps, MainViewOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(MainView);
