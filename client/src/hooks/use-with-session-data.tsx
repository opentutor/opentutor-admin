/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  fetchSessionsData,
  InvalidateResponseInput,
  invalidateResponses,
} from "api";
import { Connection, Lesson, Session } from "types";

export function copyAndSet<T>(a: T[], i: number, item: T): T[] {
  return [...a.slice(0, i), item, ...a.slice(i + 1)];
}

export interface SessionData {
  id: string;
  date: string;
  username: string;
  userAnswer: string;
  userAnswerId: string;
  classifierGrade: string;
  confidence: string;
  grade: string; //dropdown
  session: string;
  accurate: string;
  invalid: boolean;
}

export function useWithSessionData(
  lessonId: string,
  expectationId: string,
  limit = 500
): {
  rows: SessionData[];
  expectationTitle: string;
  toggleInvalids: (responseIds: string[], invalid: boolean) => void;
} {
  const [cookies] = useCookies(["accessToken"]);
  const [sessions, setSessions] = useState<Connection<Session>>();
  const [lesson, setLesson] = useState<Lesson>();
  const [rows, setRows] = React.useState<SessionData[]>([]);

  useEffect(() => {
    let mounted = true;
    const filter = { lessonId };
    fetchSessionsData(filter, limit, cookies.accessToken, lessonId)
      .then((data) => {
        if (mounted && data) {
          setSessions(data.sessions);
          setLesson(data.lesson);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, [lessonId, expectationId]);

  useEffect(() => {
    if (!sessions || !lesson) {
      return;
    }
    const data: SessionData[] = [];
    sessions.edges.forEach((e) => {
      const session = e.node;
      for (const [i, response] of session.userResponses.entries()) {
        const exp = response.expectationScores.find(
          (e) => e.expectationId == expectationId
        );
        if (!exp) {
          continue;
        }
        data.push({
          id: `${session.sessionId}-${i}`,
          session: session.sessionId,
          date: session.createdAt,
          username: session.username,
          userAnswer: response.text,
          userAnswerId: response._id,
          classifierGrade: exp.classifierGrade,
          grade: exp.graderGrade || "",
          confidence: "",
          accurate: exp.graderGrade
            ? exp.classifierGrade === exp.graderGrade
              ? "Yes"
              : "No"
            : "Ungraded",
          invalid: exp.invalidated,
        });
      }
    });
    setRows(data);
  }, [sessions, lesson]);

  async function toggleInvalids(responseIds: string[], invalid: boolean) {
    if (!sessions) {
      return;
    }
    const responseDict: Record<string, string[]> = {};
    rows
      .filter((r) => responseIds.includes(r.id))
      .forEach((r) => {
        if (r.session in responseDict) {
          responseDict[r.session].push(r.userAnswerId);
        } else {
          responseDict[r.session] = [r.userAnswerId];
        }
      });
    const responses: InvalidateResponseInput[] = Object.entries(
      responseDict
    ).map((r) => ({
      sessionId: r[0],
      responseIds: r[1],
    }));
    invalidateResponses(expectationId, invalid, responses, cookies.accessToken)
      .then((s) => {
        let updatedSessions = sessions;
        for (const session of s) {
          const sIdx = updatedSessions.edges.findIndex(
            (e) => e.node.sessionId === session.sessionId
          );
          if (sIdx !== -1) {
            updatedSessions = {
              ...updatedSessions,
              edges: copyAndSet(updatedSessions.edges, sIdx, {
                ...updatedSessions.edges[sIdx],
                node: session,
              }),
            };
          }
        }
        setSessions(updatedSessions);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return {
    rows: rows,
    expectationTitle:
      lesson?.expectations.find((e) => e.expectationId == expectationId)
        ?.expectation || "",
    toggleInvalids,
  };
}
