import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton.jsx";
import OperationButton from "./OperationButton.jsx";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  ADD_OPERATOR: "add-operator",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: payload.digit,
          overwrite: null,
        };
      }
      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: "0.",
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.ADD_OPERATOR:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.currentOperand == null && state.operation) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.currentOperand && state.previousOperand && state.operation) {
        return {
          ...state,
          previousOperand: evaluate(state),
          currentOperand: null,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: state.currentOperand,
        currentOperand: null,
        operation: payload.operation,
        overwrite: false,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: null,
          overwrite: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
        overwrite: true,
      };
    default:
      return state;
  }
}

export function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let calc;
  switch (operation) {
    case "+":
      calc = prev + current;
      break;
    case "-":
      calc = prev - current;
      break;
    case "*":
      calc = prev * current;
      break;
    case "÷":
      calc = prev / current;
      break;
  }
  return calc.toString();
}

const NUMBER_FORMATTER = Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

export function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return NUMBER_FORMATTER.format(integer);
  return `${NUMBER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output" data-testid="output">
        <div data-testid="previous">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div data-testid="current">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
