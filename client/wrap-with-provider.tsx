import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import store from "store/reducer";
import logger from "redux-logger";

const storeObj = createStore(store, applyMiddleware(...[thunk, logger]));

export const WrapWithProvider: React.FC = ({ children }) => {
  return <Provider store={storeObj}>{children}</Provider>;
};

WrapWithProvider.displayName = "WrappedWithProvider";

export default WrapWithProvider;
