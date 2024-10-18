/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { fetchLessons } from "api";
import { Connection, Lesson } from "types";
import {
  UseStaticDataConnection,
  useWithStaticDataConnection,
} from "../hooks/data-helpers/use-with-static-data-connection";

export function useWithLessons(
  accessToken: string
): UseStaticDataConnection<Lesson> {
  const {
    data,
    error,
    isLoading,
    searchParams,
    pageData,
    pageSearchParams,
    sortBy,
    filter,
    setPreFilter,
    setPostSort,
    nextPage,
    prevPage,
    setPageSize,
    reloadData,
  } = useWithStaticDataConnection<Lesson>(fetch);

  function fetch(): Promise<Connection<Lesson>> {
    return fetchLessons(
      searchParams.filter,
      searchParams.limit,
      searchParams.cursor,
      searchParams.sortBy,
      searchParams.sortAscending,
      accessToken
    );
  }

  return {
    data,
    error,
    isLoading,
    searchParams,
    pageSearchParams,
    pageData,
    sortBy,
    filter,
    setPreFilter,
    setPostSort,
    nextPage,
    prevPage,
    setPageSize,
    reloadData,
  };
}
