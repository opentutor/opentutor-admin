/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useCallback } from "react";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby";

/**
 * Custom hook to replace use-query-params library
 * Provides functionality to read and update URL query parameters
 */
export function useQueryParam(
  key: string
): [string | null | undefined, (value: string | null | undefined) => void] {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  // Only read query params on the client side to avoid SSR hydration mismatch
  const value = typeof window !== "undefined" ? params.get(key) : null;

  const setValue = useCallback(
    (newValue: string | null | undefined) => {
      const newParams = new URLSearchParams(location.search);

      if (newValue === null || newValue === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, newValue);
      }

      const newSearch = newParams.toString();
      const newUrl = newSearch
        ? `${location.pathname}?${newSearch}`
        : location.pathname;

      navigate(newUrl, { replace: true });
    },
    [key, location.pathname, location.search, navigate]
  );

  return [value, setValue];
}
