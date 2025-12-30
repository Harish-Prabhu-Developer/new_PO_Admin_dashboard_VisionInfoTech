// Store.js
import { configureStore } from "@reduxjs/toolkit";
import poHeaderReducer from "./Slice/PO/poHeaderSlice";
import poDetail1Reducer from "./Slice/PO/poDetail1Slice";
import poDetail2Reducer from "./Slice/PO/poDetail2Slice";
import poDetail3Reducer from "./Slice/PO/poDetail3Slice";
import poDetail4Reducer from "./Slice/PO/poDetail4Slice";

const store = configureStore({
  reducer: {
    poHeader: poHeaderReducer,
    poDetail1: poDetail1Reducer,
    poDetail2: poDetail2Reducer,
    poDetail3: poDetail3Reducer,
    poDetail4: poDetail4Reducer,
  },
});

export default store;