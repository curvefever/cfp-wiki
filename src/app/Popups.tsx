'use client'
import { Dispatch, createContext, useContext, useReducer } from "react";

const PopupsContext = createContext<{ state: IState, dispatch: Dispatch<IAction>}>({ state: { popups: [] }, dispatch: () => {} });

interface IState {
    popups: React.ReactNode[];
}

type IAction = IAddPopupAction | IRemovePopupAction;

interface IAddPopupAction {
    type: 'addPopup';
    popup: React.ReactNode;
}

interface IRemovePopupAction {
    type: 'removePopup';
}

const reducer = (state: IState, action: IAction) => {
    switch (action.type) {
      case 'addPopup':
        return { popups: [...state.popups, action.popup] };
      case 'removePopup':
        return { popups: state.popups.slice(0, -1) };
      default:
        throw new Error();
    }
};

export default function Popups({ children }: { children: React.ReactNode }) {
    const [state, dispatch] =  useReducer(reducer, { popups: [] });

    return (
        <PopupsContext.Provider value={{ state, dispatch }}>
            {children}
            <div>
                {state.popups}
            </div>
        </PopupsContext.Provider>
    )
}

export const usePopupsContext = () => useContext(PopupsContext);
