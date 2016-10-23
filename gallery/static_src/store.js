import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
import {routerReducer as routing} from 'react-router-redux';
import {reducer as form} from 'redux-form/immutable';
import thunkMiddleware from 'redux-thunk';

import edegal from './modules';


const reducers = combineReducers({
  edegal,
  reduxAsyncConnect,
  routing,
  form,
});


export default () => createStore(
  reducers,
  undefined,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);