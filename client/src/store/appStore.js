import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import companyReducer from './slices/companySlice'
import applicationReducer from './slices/applicationSlice'
const rootReducer = combineReducers({
  auth: authReducer,
  job:jobReducer,
  company:companyReducer,
  application:applicationReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = 
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware())
);

export const persistor = persistStore(store);