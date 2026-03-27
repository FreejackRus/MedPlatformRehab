import { useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "../../shared/api/client.js";
import { connectSocket } from "../../shared/api/socket.js";
import { createAuthActions } from "../../features/auth/model/actions.js";
import { createChatActions } from "../../features/chat/model/actions.js";
import { createDoctorFilterActions } from "../../features/doctor-filter/model/actions.js";
import { createJournalActions } from "../../features/journal/model/actions.js";
import { createRehabActions } from "../../features/rehab/model/actions.js";
import { createWorkspaceNavigationActions } from "../../features/workspace-navigation/model/actions.js";
import { bootstrapSession } from "./model/bootstrap.js";
import { createDefaultAppState } from "./model/defaultState.js";
import { deriveState } from "./model/deriveState.js";
import { clearPersistedState, loadState, persistState } from "./model/persistence.js";

export function useAppStore() {
  const [state, setState] = useState(loadState);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const bootstrappedRef = useRef(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    persistState(state);
  }, [state]);

  useEffect(() => {
    const token = state.role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
    apiClient.setToken(token);
  }, [state.auth.doctorToken, state.auth.patientToken, state.role]);

  useEffect(() => {
    if (bootstrappedRef.current) {
      return;
    }
    bootstrappedRef.current = true;

    bootstrapSession({ initialState: stateRef.current, setState }).catch(() => {});
  }, []);

  useEffect(() => {
    const authorized = state.auth.patientAuthorized || state.auth.doctorAuthorized;
    if (!authorized) {
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    socketRef.current?.close();
    const token = state.role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
    if (!token) {
      return;
    }

    const socket = connectSocket(token, (event) => {
      if (event.type === "thread.updated") {
        setState((current) => ({
          ...current,
          chatThreads: current.chatThreads.map((thread) => (thread.id === event.payload.id ? event.payload : thread)),
        }));
      }
    });
    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [state.auth.patientAuthorized, state.auth.doctorAuthorized, state.auth.doctorToken, state.auth.patientToken, state.role]);

  const getState = () => stateRef.current;
  const resetToDefaultState = () => {
    clearPersistedState();
    setState(createDefaultAppState());
  };

  const actions = useMemo(
    () => ({
      ...createAuthActions({ getState, setState, setLoading, resetToDefaultState }),
      ...createWorkspaceNavigationActions({ setState }),
      ...createRehabActions({ getState, setState }),
      ...createJournalActions({ getState, setState }),
      ...createDoctorFilterActions({ setState }),
      ...createChatActions({ getState, setState }),
    }),
    []
  );

  const derived = useMemo(() => deriveState(state), [state]);

  return { state, actions, derived, loading };
}
