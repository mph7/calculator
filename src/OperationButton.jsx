import React from "react";
import { ACTIONS } from "./App.jsx";

function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.ADD_OPERATOR, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}

export default OperationButton;
