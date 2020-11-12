/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { useCookies } from "react-cookie";
import { fetchGoogleProfile } from "api";
import { getClientID } from "config";
import { Profile } from "types";

const ToggleContext = React.createContext({
  googleClientId: "",
  userid: null,
  username: null,
  showGraded: false,
  onlyCreator: false,
  // eslint-disable-next-line
  toggleGraded: () => {},
  // eslint-disable-next-line
  toggleCreator: () => {},
});

const ToggleProvider = (props: { children: any }) => {
  const [cookies] = useCookies(["accessToken"]);
  const [googleClientId, setClientId] = React.useState<string>("");
  const [userid, setUserid] = React.useState();
  const [username, setUsername] = React.useState();
  const [showGraded, setShowGraded] = React.useState(false);
  const [onlyCreator, setOnlyCreator] = React.useState(
    cookies.accessToken || cookies.user ? true : false
  );

  React.useEffect(() => {
    getClientID().then((id: string) => {
      setClientId(id);
    });
  }, []);

  React.useEffect(() => {
    if (cookies.accessToken) {
      fetchGoogleProfile(cookies.accessToken).then((profile: Profile) => {
        setUserid(profile.id);
        setUsername(profile.given_name);
      });
    }
  }, [cookies]);

  const toggleGraded = () => {
    setShowGraded(!showGraded);
  };

  const toggleCreator = () => {
    setOnlyCreator(!onlyCreator);
  };

  return (
    <ToggleContext.Provider
      value={{
        googleClientId,
        userid,
        username,
        showGraded,
        toggleGraded,
        onlyCreator,
        toggleCreator,
      }}
    >
      {props.children}
    </ToggleContext.Provider>
  );
};

export default ToggleContext;
export { ToggleProvider };
