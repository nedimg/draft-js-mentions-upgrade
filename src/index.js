
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import App from './App';


const loggerMiddleware = createLogger();

const INITIAL_STATE = {
    byId: {
        a: { id: 'a', name: 'design' },
        b: { id: 'b', name: 'cooool' },
        c: { id: 'c', name: 'search' },
    },
    usedLabels: [],
};

const labelReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    case 'CREATE':
        return {
            ...state,
            byId: {
                ...state.byId,
                [payload.id]: payload,
            },
        };
    case 'DO_LABEL':
        if (state.usedLabels.findIndex(l => l === payload) === -1) {
            return { ...state, usedLabels: [...state.usedLabels, payload] };
        }
        return state;
    case 'DO_UNLABEL':
        return {
            ...state,
            usedLabels: [
                ...state.usedLabels.slice(0, state.usedLabels.findIndex(l => l === payload)),
                ...state.usedLabels.slice(state.usedLabels.findIndex(l => l === payload) + 1),
            ],
        };
    default:
        return state;
    }
};

const store = createStore(
    combineReducers({
        labels: labelReducer,
    }),
    {},
    applyMiddleware(loggerMiddleware),
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

if (process.env.NODE_ENV !== 'production') {
    window.React = React; // Enable react devtools
}
