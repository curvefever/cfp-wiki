"use client";

import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

const PopupsContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: { popups: [] },
  dispatch: () => {},
});

interface State {
  popups: ReactNode[];
}

type Action = AddPopupAction | RemovePopupAction;

interface AddPopupAction {
  type: "addPopup";
  popup: ReactNode;
}

interface RemovePopupAction {
  type: "removePopup";
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "addPopup":
      return { popups: [...state.popups, action.popup] };
    case "removePopup":
      return { popups: state.popups.slice(0, -1) };
  }
};

export default function PopupProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { popups: [] });

  return (
    <PopupsContext.Provider value={{ state, dispatch }}>
      {children}
      <div>{state.popups}</div>
    </PopupsContext.Provider>
  );
}

export const usePopupsContext = () => useContext(PopupsContext);
