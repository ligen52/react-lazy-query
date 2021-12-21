import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { renderHook, act } from "@testing-library/react-hooks";
import useLazyCountries, { COUNTRIES } from "./useLazyCountries";

describe("useCountries custom hook", () => {
  // :: DATA ::
  const mexico = {
    name: "México",
    code: "MX"
  };
  const argentina = {
    name: "Argentina",
    code: "AR"
  };
  const portugal = {
    name: "Portugal",
    code: "PT"
  };

  // :: QUERIES MOCK ::
  const countriesQueryMock = {
    request: {
      query: COUNTRIES
    },
    result: {
      data: {
        countries: [argentina, mexico, portugal]
      }
    }
  };

  const countriesQueryErrorMock = {
    request: {
      query: COUNTRIES
    },
    error: new Error("aw shucks")
  };

  function getHookWrapper(mocks = []) {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(() => useLazyCountries(), {
      wrapper
    });

    // useLazyCountries returns an array where the first item is a function to fetch the countries
    // and the second item is an object with the data,loading and error properties
    expect(typeof result.current[0]).toBe("function");
    expect(result.current[1].loading).toBeFalsy();
    expect(result.current[1].error).toBeUndefined();
    expect(result.current[1].countries).toBeUndefined();

    // call the lazy function
    act(() => {
      result.current[0]();
    });
    return { result, waitForNextUpdate };
  }

  it("should return an array of countries", async () => {
    const { result, waitForNextUpdate } = getHookWrapper([countriesQueryMock]);

    await waitForNextUpdate();
    console.log(result.current);
    expect(result.current[1].loading).toBeFalsy();
    expect(result.current[1].error).toBeUndefined();
    expect(result.current[1].countries).toEqual([
      `${argentina.name} - ${argentina.code}`,
      `${mexico.name} - ${mexico.code}`,
      `${portugal.name} - ${portugal.code}`
    ]);
  });

  it("should return error when request fails", async () => {
    const { result, waitForNextUpdate } = getHookWrapper([
      countriesQueryErrorMock
    ]);
    await waitForNextUpdate();
    expect(result.current[1].loading).toBeFalsy();
    expect(result.current[1].error).toBeTruthy();
    expect(result.current[1].countries).toBeUndefined();
  });
});
