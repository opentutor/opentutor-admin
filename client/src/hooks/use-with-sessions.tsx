/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchSessions } from "api";
import { Connection, Session } from "types";
import SessionContext from "context/session";

export interface SearchParams {
  limit: number;
  cursor: string;
  sortBy: string;
  sortAscending: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: Record<string, any>;
}

export function useWithSessions(
  lessonId?: string,
  existingCursor?: string
): {
  sessions: Connection<Session> | undefined;
  sortBy: string;
  sortAsc: boolean;
  sort: (id: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  loading: boolean;
  cursor: string;
} {
  const context = useContext(SessionContext);
  const [cookies] = useCookies(["accessToken"]);
  const [sessions, setSessions] = useState<Connection<Session>>();
  const [cursor, setCursor] = useState(
    existingCursor || context.startCursor || ""
  );
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 50;

  useEffect(() => {
    if (lessonId) {
      context.setFilterByLesson(lessonId);
    }
  }, [lessonId]);

  useEffect(() => {
    context.setStartCursor(cursor);
  }, [cursor]);

  useEffect(() => {
    load();
  }, [
    context.onlyCreator,
    context.showGraded,
    context.showAbandoned,
    context.filterByLesson,
    rowsPerPage,
    cursor,
    sortBy,
    sortAsc,
  ]);

  function load() {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (context.onlyCreator) {
      filter.lessonCreatedBy = context.user?.name;
    }
    if (!context.showGraded) {
      filter.graderGrade = null;
    }
    if (!context.showAbandoned) {
      filter.sessionStatus = { $ne: "LAUNCHED" };
    }
    if (lessonId || context.filterByLesson) {
      filter.lessonId = lessonId || context.filterByLesson;
    }
    fetchSessions(
      filter,
      rowsPerPage,
      cursor,
      sortBy,
      sortAsc,
      cookies.accessToken
    )
      .then((sessions) => {
        if (sessions) {
          setSessions(sessions);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  function sort(id: string) {
    if (sortBy === id) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(id);
    }
    setCursor("");
  }

  function nextPage() {
    if (!sessions) {
      return;
    }
    const newCursor = "next__" + sessions.pageInfo.endCursor;
    context.setStartCursor(newCursor);
    setCursor(newCursor);
  }

  function prevPage() {
    if (!sessions) {
      return;
    }
    const newCursor = "prev__" + sessions.pageInfo.startCursor;
    context.setStartCursor(newCursor);
    setCursor(newCursor);
  }

  return {
    sessions,
    sortBy,
    sortAsc,
    sort,
    nextPage,
    prevPage,
    cursor,
    loading,
  };
}
