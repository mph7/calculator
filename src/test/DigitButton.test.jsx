/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DigitButton from "../DigitButton";
import { ACTIONS } from "../App";

describe("DigitButton component", () => {
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."])(
    "show correct digit for '%s'",
    (digit) => {
      const { getByText } = render(<DigitButton digit={digit} />);
      expect(getByText(digit)).toBeInTheDocument();
    }
  );
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."])(
    "should call dispatch function correctly for %s",
    (digit) => {
      const mockDispatch = jest.fn();
      const { getByText } = render(
        <DigitButton digit={digit} dispatch={mockDispatch} />
      );
      fireEvent.click(getByText(digit));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: ACTIONS.ADD_DIGIT,
        payload: { digit },
      });
    }
  );
});
