import React, {createContext, useContext, useReducer} from "react";

export const initialState = {
    currentRoom: {
        id: '',
        name: 'Whosapp'
    }
};

const roomReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_ROOM':
            return {
                ...state,
                currentRoom: action.payload
            };
        default:
            return state;
    }
};

const RoomState = ({children}) => {
    const [state, dispatch] = useReducer(roomReducer, initialState);

    return (
        <RoomContext.Provider value={[state, dispatch]}>
            {children}
        </RoomContext.Provider>
    )
};

const RoomContext = createContext(initialState);
export const useRoomContext = () => useContext(RoomContext)
export default RoomState;
