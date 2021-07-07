/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { v4 as uuid } from "uuid";

import { fetchSessionsData } from "api";
import { Connection, Lesson, Session } from "types";

export interface SessionData {
  id: string;
  date: string;
  username: string;
  userAnswer: string;
  classifierGrade: string;
  confidence: string;
  grade: string; //dropdown
  session: string;
  accurate: string;
}

export function useWithSessionData(lessonId: string, expectation: string) {
  const [cookies] = useCookies(["accessToken"]);
  const [sessions, setSessions] = useState<Connection<Session>>();
  const [lesson, setLesson] = useState<Lesson>();
  const [rows, setRows] = React.useState<SessionData[]>([]);

  useEffect(() => {
    load();
  });

  useEffect(() => {
    if (!sessions || !lesson) {
      return;
    }
    const data: SessionData[] = [];
    sessions.edges.forEach((e) => {
      const session = e.node;
      for (const [i, response] of session.userResponses.entries()) {
        const expIdx = lesson.expectations.findIndex(
          (e) => e.expectation === expectation
        );
        if (expIdx === -1) {
          continue;
        }
        const exp = response.expectationScores[expIdx];
        data.push({
          id: uuid(),
          session: session.sessionId,
          date: session.createdAt,
          username: session.username,
          userAnswer: response.text,
          classifierGrade: exp.classifierGrade,
          grade: exp.graderGrade || "",
          confidence: "",
          accurate: exp.graderGrade
            ? exp.classifierGrade === exp.graderGrade
              ? "Yes"
              : "No"
            : "Ungraded",
        });
      }
    });
    setRows(data);
    console.log(data);
  }, [sessions]);

  function load() {
    const filter = { lessonId: lessonId };
    fetchSessionsData(filter, 10000, cookies.accessToken)
      .then((data) => {
        if (data) {
          setSessions(data.sessions);
          setLesson(data.lesson);
        }
      })
      .catch((err) => console.error(err));
  }

  return rows;
}
