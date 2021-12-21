import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";
import { useMemo } from "react";

export const COUNTRIES = gql`
  query {
    countries {
      name
      code
    }
  }
`;

export default function useLazyCountries(queryOptions = {}) {
  const [fetchCountries, { loading, error, data }] = useLazyQuery(
    COUNTRIES,
    queryOptions
  );
  const countries = useMemo(() => {
    if (data) {
      return data.countries.map(
        (country) => `${country.name} - ${country.code}`
      );
    }
  }, [data]);
  return [fetchCountries, { loading, error, countries }];
}
