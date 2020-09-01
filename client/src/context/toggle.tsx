import React from "react";
import { useCookies } from "react-cookie";

const ToggleContext = React.createContext({
  showGraded: false,
  onlyCreator: false,
  toggleGraded: () => {
    1 + 1;
  },
  toggleCreator: () => {
    1 + 1;
  },
});

const ToggleProvider = (props: { children: any }) => {
  const [cookies] = useCookies(["user"]);
  const [showGraded, setShowGraded] = React.useState(false);
  const [onlyCreator, setOnlyCreator] = React.useState(
    cookies.user ? true : false
  );

  const toggleGraded = () => {
    setShowGraded(!showGraded);
  };

  const toggleCreator = () => {
    setOnlyCreator(!onlyCreator);
  };

  return (
    <ToggleContext.Provider
      value={{
        showGraded,
        onlyCreator,
        toggleGraded,
        toggleCreator,
      }}
    >
      {props.children}
    </ToggleContext.Provider>
  );
};

export default ToggleContext;
export { ToggleProvider };
