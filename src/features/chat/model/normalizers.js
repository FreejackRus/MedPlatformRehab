export function normalizePatientMessageResponse(response, currentState) {
  if (response && response.thread) {
    return {
      thread: response.thread,
      journal: response.journal ?? currentState.journal,
      journalDraft: response.journal ?? currentState.journalDraft,
      progress: response.progress ?? currentState.progress,
      incidents: response.incidents ?? currentState.incidents,
    };
  }

  return {
    thread: response,
    journal: currentState.journal,
    journalDraft: currentState.journalDraft,
    progress: currentState.progress,
    incidents: currentState.incidents,
  };
}
