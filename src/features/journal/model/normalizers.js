export function normalizeJournalResponse(response, currentState) {
  if (response && response.journal) {
    return {
      journal: response.journal,
      journalDraft: response.journal,
      progress: response.progress ?? currentState.progress,
      incidents: response.incidents ?? currentState.incidents,
    };
  }

  return {
    journal: response ?? currentState.journalDraft,
    journalDraft: response ?? currentState.journalDraft,
    progress: currentState.progress,
    incidents: currentState.incidents,
  };
}
