/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { ACTIONS } from "../src/App.jsx";
import OperationButton from "../src/OperationButton.jsx";

describe("OperationButton component", () => {
  test.each(["+", "-", "*", "÷"])(
    "show correct operation for '%s'",
    (operation) => {
      const { getByText } = render(<OperationButton operation={operation} />);
      expect(getByText(operation)).toBeInTheDocument();
    }
  );

  test.each(["+", "-", "*", "÷"])(
    "should call dispatch function correctly for %s",
    (operation) => {
      const mockDispatch = jest.fn();
      const { getByText } = render(
        <OperationButton operation={operation} dispatch={mockDispatch} />
      );
      fireEvent.click(getByText(operation));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: ACTIONS.ADD_OPERATOR,
        payload: { operation },
      });
    }
  );
});
