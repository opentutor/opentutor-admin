/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { useCookies } from "react-cookie";
import { login } from "api";
import { User, UserAccessToken } from "types";

type ContextType = {
  user: User | undefined;
  isClient: boolean;
  showGraded: boolean;
  showAbandoned: boolean;
  onlyCreator: boolean;
  filterByLesson: string;
  filterByUsername: string;
  startCursor: string;
  setStartCursor: (cursor: string) => void;
  setFilterByLesson: (lesson: string) => void;
  setFilterByUsername: (username: string) => void;
  toggleGraded: () => void;
  toggleCreator: () => void;
  toggleAbandoned: () => void;
};

const SessionContext = React.createContext<ContextType>({
  user: undefined,
  isClient: false,
  showGraded: false,
  showAbandoned: false,
  onlyCreator: false,
  filterByLesson: "",
  filterByUsername: "",
  startCursor: "",
  // eslint-disable-next-line
  setFilterByUsername: () => {},
  // eslint-disable-next-line
  setStartCursor: () => {},
  // eslint-disable-next-line
  setFilterByLesson: () => {},
  // eslint-disable-next-line
  toggleGraded: () => {},
  // eslint-disable-next-line
  toggleCreator: () => {},
  // eslint-disable-next-line
  toggleAbandoned: () => {},
});

function SessionProvider(props: { children?: React.ReactNode }): JSX.Element {
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "user",
  ]);
  const [isClient, setIsClient] = React.useState(false);
  const [user, setUser] = React.useState<User>();
  const [showGraded, setShowGraded] = React.useState(false);
  const [onlyCreator, setOnlyCreator] = React.useState(false);
  const [showAbandoned, setShowAbandoned] = React.useState(false);
  const [filterByLesson, setFilterByLesson] = React.useState("");
  const [startCursor, setStartCursor] = React.useState("");
  const [filterByUsername, setFilterByUsername] = React.useState("");

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    // Only read cookies after client hydration to avoid SSR mismatch
    if (!isClient) {
      return;
    }

    if (!cookies.accessToken) {
      setUser(undefined);
      setOnlyCreator(false);
    } else {
      setOnlyCreator(true);
      if (!user) {
        login(cookies.accessToken)
          .then((token: UserAccessToken) => {
            setUser(token.user);
            setCookie("accessToken", token.accessToken, {
              secure: true,
              sameSite: "none",
              path: "/",
            });
          })
          .catch((err) => {
            console.error(err);
            removeCookie("accessToken", { path: "/" });
          });
      }
    }
  }, [isClient, cookies]);

  function toggleGraded(): void {
    setShowGraded(!showGraded);
  }

  function toggleCreator(): void {
    setOnlyCreator(!onlyCreator);
  }

  function toggleAbandoned(): void {
    setShowAbandoned(!showAbandoned);
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isClient,
        filterByLesson,
        filterByUsername,
        setFilterByLesson,
        setFilterByUsername,
        showGraded,
        toggleGraded,
        onlyCreator,
        toggleCreator,
        showAbandoned,
        toggleAbandoned,
        startCursor,
        setStartCursor,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export default SessionContext;
export { SessionProvider };
