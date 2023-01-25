/**
 * @jest-environment jsdom
 */

import React, { useReducer } from "react";
import { cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import App, { ACTIONS, evaluate, formatOperand, reducer } from "../App";
import { act } from "react-test-renderer";

afterEach(cleanup);

describe("reducer", () => {
  describe("ADD_DIGIT", () => {
    test("should return the initial state", () => {
      expect(reducer({}, {})).toEqual({});
    });
    test("should add digits correctly", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: null,
        overwrite: null,
      };
      const action = {
        type: ACTIONS.ADD_DIGIT,
        payload: { digit: "1" },
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: "1",
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test("should return 0. when i put only dot", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: null,
        overwrite: null,
      };
      const action = {
        type: ACTIONS.ADD_DIGIT,
        payload: { digit: "." },
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: "0.",
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test("should not add dot if current operand already have dot", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: "1.",
        overwrite: null,
      };
      const action = {
        type: ACTIONS.ADD_DIGIT,
        payload: { digit: "." },
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: "1.",
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test("should overwrite current operand", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: "123",
        overwrite: true,
      };
      const action = {
        type: ACTIONS.ADD_DIGIT,
        payload: { digit: "2" },
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: "2",
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
  });
  describe("ADD_OPERATOR", () => {
    test.each(["+", "-", "*", "÷"])(
      "should add '%s' operator correctly",
      (operation) => {
        const state = {
          previousOperand: null,
          operation: null,
          currentOperand: "123",
          overwrite: null,
        };
        const action = {
          type: ACTIONS.ADD_OPERATOR,
          payload: { operation },
        };
        const expected = {
          previousOperand: "123",
          operation,
          currentOperand: null,
          overwrite: false,
        };
        expect(reducer(state, action)).toEqual(expected);
      }
    );
    test.each(["+", "-", "*", "÷"])(
      "should not add '%s' operator when current operand is null",
      (operation) => {
        const state = {
          previousOperand: null,
          operation: null,
          currentOperand: null,
          overwrite: null,
        };
        const action = {
          type: ACTIONS.ADD_OPERATOR,
          payload: { operation },
        };
        const expected = {
          previousOperand: null,
          operation: null,
          currentOperand: null,
          overwrite: null,
        };
        expect(reducer(state, action)).toEqual(expected);
      }
    );
    ["+", "-", "*", "÷"].forEach((operation) => {
      test.each(["+", "-", "*", "÷"])(
        "should overwrite the current operation '%s' to '$newOperation'",
        (newOperation) => {
          const state = {
            previousOperand: "123",
            operation,
            currentOperand: null,
            overwrite: null,
          };
          const action = {
            type: ACTIONS.ADD_OPERATOR,
            payload: { operation: newOperation },
          };
          const expected = {
            previousOperand: "123",
            operation: newOperation,
            currentOperand: null,
            overwrite: null,
          };
          expect(reducer(state, action)).toEqual(expected);
        }
      );
    });
    test.each([
      {
        operand: "+",
        previousOperand: "123",
        currentOperand: "456",
        expected: "579",
      },
      {
        operand: "-",
        previousOperand: "123",
        currentOperand: "456",
        expected: "-333",
      },
      {
        operand: "*",
        previousOperand: "123",
        currentOperand: "456",
        expected: "56088",
      },
      {
        operand: "÷",
        previousOperand: "400",
        currentOperand: "50",
        expected: "8",
      },
    ])(
      "should evaluate the expression when all operand operand is there",
      ({ operand, previousOperand, currentOperand, expected }) => {
        const state = {
          previousOperand,
          operation: operand,
          currentOperand,
          overwrite: null,
        };
        const action = {
          type: ACTIONS.ADD_OPERATOR,
          payload: { operation: operand },
        };
        const expectedState = {
          previousOperand: expected,
          operation: operand,
          currentOperand: null,
          overwrite: null,
        };
        expect(reducer(state, action)).toEqual(expectedState);
      }
    );
  });
  describe("DELETE_DIGIT", () => {
    test("should delete everything if overwrite is true", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: "123",
        overwrite: true,
      };
      const action = {
        type: ACTIONS.DELETE_DIGIT,
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: null,
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test("should return null if current operand is null", () => {
      const state = {
        previousOperand: null,
        operation: null,
        currentOperand: null,
        overwrite: null,
      };
      const action = {
        type: ACTIONS.DELETE_DIGIT,
      };
      const expected = {
        previousOperand: null,
        operation: null,
        currentOperand: null,
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test("should return null if current operand is 1 digit long", () => {
      const state = {
        previousOperand: "123",
        operation: "+",
        currentOperand: "6",
        overwrite: null,
      };
      const action = {
        type: ACTIONS.DELETE_DIGIT,
      };
      const expected = {
        previousOperand: "123",
        operation: "+",
        currentOperand: null,
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expected);
    });
    test.each([
      { input: "123", expected: "12" },
      { input: "12", expected: "1" },
      { input: "1", expected: null },
      { input: "123.456", expected: "123.45" },
      { input: "123.45", expected: "123.4" },
      { input: "123.4", expected: "123." },
      { input: "123.", expected: "123" },
      { input: "123", expected: "12" },
      { input: "12", expected: "1" },
      { input: "1", expected: null },
    ])('should delete the last digit "%s" to "%s"', ({ input, expected }) => {
      const state = {
        previousOperand: "123",
        operation: "+",
        currentOperand: input,
        overwrite: null,
      };
      const action = {
        type: ACTIONS.DELETE_DIGIT,
      };
      const expectedState = {
        previousOperand: "123",
        operation: "+",
        currentOperand: expected,
        overwrite: null,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });
  describe("CLEAR", () => {
    test("should clear all operands", () => {
      const state = {
        previousOperand: "123",
        operation: "+",
        currentOperand: "456",
        overwrite: null,
      };
      const action = {
        type: ACTIONS.CLEAR,
      };
      const expected = {};
      expect(reducer(state, action)).toEqual(expected);
    });
  });
  describe("EVALUATE", () => {
    test.each([
      {
        operand: "+",
        previousOperand: "123",
        currentOperand: "456",
        expected: "579",
      },
      {
        operand: "-",
        previousOperand: "123",
        currentOperand: "456",
        expected: "-333",
      },
      {
        operand: "*",
        previousOperand: "123",
        currentOperand: "456",
        expected: "56088",
      },
      {
        operand: "÷",
        previousOperand: "400",
        currentOperand: "50",
        expected: "8",
      },
    ])(
      "should evaluate the expression when all operand operand is there",
      ({ operand, previousOperand, currentOperand, expected }) => {
        const state = {
          previousOperand,
          operation: operand,
          currentOperand,
          overwrite: null,
        };
        const action = {
          type: ACTIONS.EVALUATE,
        };
        const expectedState = {
          previousOperand: null,
          operation: null,
          currentOperand: expected,
          overwrite: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
      }
    );
    test.each([
      {
        operand: "+",
        previousOperand: null,
        currentOperand: "456",
      },
      {
        operand: null,
        previousOperand: "123",
        currentOperand: null,
      },
      {
        operand: "*",
        previousOperand: null,
        currentOperand: null,
      },
      {
        operand: "÷",
        previousOperand: "400",
        currentOperand: null,
      },
      {
        operand: null,
        previousOperand: null,
        currentOperand: null,
      },
    ])(
      "should evaluate the expression when all operand operand is there",
      ({ operand, previousOperand, currentOperand }) => {
        const state = {
          previousOperand,
          operation: operand,
          currentOperand,
          overwrite: null,
        };
        const action = {
          type: ACTIONS.EVALUATE,
        };
        expect(reducer(state, action)).toEqual(state);
      }
    );
    test.each([
      { prev: "300", operand: "+", curr: "200", expected: "500" },
      { prev: "300", operand: "-", curr: "200", expected: "100" },
      { prev: "300", operand: "*", curr: "200", expected: "60000" },
      { prev: "300", operand: "÷", curr: "200", expected: "1.5" },
      { prev: "10", operand: "+", curr: "5.5", expected: "15.5" },
      { prev: "20", operand: "-", curr: "10.25", expected: "9.75" },
      { prev: "30", operand: "*", curr: "2.5", expected: "75" },
      { prev: "40", operand: "÷", curr: "4", expected: "10" },
      {
        prev: "99999999999",
        operand: "*",
        curr: "99999999999",
        expected: "9.9999999998e+21",
      },
      {
        prev: "999999999999999",
        operand: "+",
        curr: "999999999999999",
        expected: "1999999999999998",
      },
    ])(
      'should evaluate the expression"',
      ({ prev, operand, curr, expected }) => {
        const state = {
          previousOperand: prev,
          operation: operand,
          currentOperand: curr,
          overwrite: null,
        };
        const action = {
          type: ACTIONS.EVALUATE,
        };
        const expectedState = {
          previousOperand: null,
          operation: null,
          currentOperand: expected,
          overwrite: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
      }
    );
  });
});
describe("evaluate", () => {
  test.each([
    {
      previousOperand: "456",
      currentOperand: "123",
      operation: "+",
      expected: "579",
    },
    {
      previousOperand: "123",
      currentOperand: "456",
      operation: "-",
      expected: "-333",
    },
    {
      previousOperand: "456",
      currentOperand: "123",
      operation: "*",
      expected: "56088",
    },
    {
      previousOperand: "400",
      currentOperand: "80",
      operation: "÷",
      expected: "5",
    },
  ])(
    'should evaluate the expression"',
    ({ currentOperand, previousOperand, operation, expected }) => {
      expect(evaluate({ currentOperand, previousOperand, operation })).toEqual(
        expected
      );
    }
  );
});

describe("formatOperand", () => {
  test("should return undefined if operand is null", () => {
    expect(formatOperand(null)).toBeUndefined();
  });
  test("should format integer number correctly", () => {
    expect(formatOperand("1234567890")).toBe("1,234,567,890");
  });
  test("should format decimal number correctly", () => {
    expect(formatOperand("1234567890.123456789")).toBe(
      "1,234,567,890.123456789"
    );
  });
});

describe("useReducer", () => {
  test("should return the initial state", () => {
    const { result } = renderHook(() => useReducer(reducer, {}));
    expect(result.current[0]).toEqual({});
  });
  test('should return the updated state for "add digit"', () => {
    const { result } = renderHook(() => useReducer(reducer, {}));
    act(() => {
      result.current[1]({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } });
    });
    expect(result.current[0]).toEqual({ currentOperand: "1" });
  });
  test('should return the updated state for "add operation"', () => {
    const { result } = renderHook(() =>
      useReducer(reducer, { currentOperand: "1234" })
    );
    act(() => {
      result.current[1]({
        type: ACTIONS.ADD_OPERATOR,
        payload: { operation: "+" },
      });
    });
    expect(result.current[0]).toEqual({
      previousOperand: "1234",
      operation: "+",
      currentOperand: null,
      overwrite: false,
    });
  });
  test('should return the updated state for "evaluate"', () => {
    const { result } = renderHook(() =>
      useReducer(reducer, {
        previousOperand: "1234",
        operation: "+",
        currentOperand: "456",
      })
    );
    act(() => {
      result.current[1]({ type: ACTIONS.EVALUATE });
    });
    expect(result.current[0]).toEqual({
      currentOperand: "1690",
      operation: null,
      previousOperand: null,
      overwrite: true,
    });
  });
  test('should return the updated state for "clear"', () => {
    const { result } = renderHook(() =>
      useReducer(reducer, {
        previousOperand: "1234",
        operation: "+",
        currentOperand: "456",
      })
    );
    act(() => {
      result.current[1]({ type: ACTIONS.CLEAR });
    });
    expect(result.current[0]).toEqual({});
  });
  test('should return the updated state for "delete"', () => {
    const { result } = renderHook(() =>
      useReducer(reducer, {
        previousOperand: "1234",
        operation: "+",
        currentOperand: "456",
      })
    );
    act(() => {
      result.current[1]({ type: ACTIONS.DELETE_DIGIT });
    });
    expect(result.current[0]).toEqual({
      previousOperand: "1234",
      operation: "+",
      currentOperand: "45",
    });
  });
  it("displays the correct output when buttons are clicked", () => {
    const { getByText, getByTestId } = render(<App />);

    fireEvent.click(getByText("7"));
    expect(getByTestId("current").textContent).toEqual("7");

    fireEvent.click(getByText("+"));
    expect(getByTestId("previous").textContent).toEqual("7 +");

    fireEvent.click(getByText("2"));
    expect(getByTestId("current").textContent).toEqual("2");

    fireEvent.click(getByText("="));
    expect(getByTestId("current").textContent).toEqual("9");
    expect(getByTestId("previous").textContent).toEqual(" ");

    fireEvent.click(getByText("AC"));
    const output = getByTestId("output");
    expect(output.firstChild.textContent).toEqual(" ");
    expect(output.lastChild).toBeEmptyDOMElement();
  });
});

describe("App component", () => {
  test("should render App component", () => {
    const { getByTestId, getByText } = render(<App />);
    expect(getByTestId("previous").textContent).toEqual(" ");
    expect(getByTestId("current")).toBeEmptyDOMElement();
    expect(getByText("AC")).toBeInTheDocument();
    expect(getByText("DEL")).toBeInTheDocument();
    expect(getByText("÷")).toBeInTheDocument();
    expect(getByText("*")).toBeInTheDocument();
    expect(getByText("+")).toBeInTheDocument();
    expect(getByText("-")).toBeInTheDocument();
    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("3")).toBeInTheDocument();
    expect(getByText("4")).toBeInTheDocument();
    expect(getByText("5")).toBeInTheDocument();
    expect(getByText("6")).toBeInTheDocument();
    expect(getByText("7")).toBeInTheDocument();
    expect(getByText("8")).toBeInTheDocument();
    expect(getByText("9")).toBeInTheDocument();
    expect(getByText("0")).toBeInTheDocument();
    expect(getByText(".")).toBeInTheDocument();
    expect(getByText("=")).toBeInTheDocument();
  });
  test.each([
    { text: "AC", params: { type: ACTIONS.CLEAR } },
    { text: "DEL", params: { type: ACTIONS.DELETE_DIGIT } },
    { text: "=", params: { type: ACTIONS.EVALUATE } },
  ])("should call dispatch function correctly for %s", ({ text, params }) => {
    const spy = jest.spyOn(React, "useReducer");
    const mockReducer = jest.fn();
    spy.mockImplementation((reducer, initialState) => [
      initialState,
      mockReducer,
    ]);

    const { getByText } = render(<App />);

    fireEvent.click(getByText(text));
    expect(mockReducer).toHaveBeenCalledWith(params);
  });
});
