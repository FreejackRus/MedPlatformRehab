import { getThreadStatusLabel } from "../../utils/domain.js";

function DoctorChatInbox({ threads, activeThread, draft, onSelectThread, onDraftChange, onSend }) {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="overline">Чаты пациентов</p>
          <h3>Рабочая переписка врача</h3>
        </div>
        <span className="badge">{threads.filter((thread) => thread.unreadByDoctor).length} новых</span>
      </div>

      <div className="chat-split">
        <aside className="thread-list">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={activeThread?.id === thread.id ? "thread-item active" : "thread-item"}
              onClick={() => onSelectThread(thread.id)}
            >
              <strong>{thread.title}</strong>
              <span>{getThreadStatusLabel(thread.status)}</span>
              <small>{thread.unreadByDoctor ? "Требует ответа" : "Просмотрено"}</small>
            </button>
          ))}
        </aside>

        <div className="thread-panel">
          <div className="chat-window">
            {activeThread?.messages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble ${message.author === "patient" ? "patient" : message.author === "doctor" ? "doctor" : "bot"}`}
              >
                {message.text}
                <small>{message.timestamp}</small>
              </div>
            ))}
          </div>

          <form
            className="chat-compose"
            onSubmit={(event) => {
              event.preventDefault();
              onSend();
            }}
          >
            <textarea value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Ответ врачу пациенту" />
            <button className="primary-action" type="submit">
              Отправить ответ
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export default DoctorChatInbox;
