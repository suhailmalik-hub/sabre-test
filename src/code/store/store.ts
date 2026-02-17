import { createStore } from 'redux';
import { soapReducer } from './reducer';

export const store = createStore(soapReducer);

export const getStoreData = (): any => {
    return store.getState();
};

export type StoreStateType = ReturnType<typeof store.getState>;
