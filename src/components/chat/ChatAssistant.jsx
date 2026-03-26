import { getThreadStatusLabel } from "../../utils/domain.js";

function ChatAssistant({ threads, activeThread, draft, onSelectThread, onDraftChange, onSend }) {
  return (
    <article className="card" id="chat">
      <div className="card-head">
        <div>
          <p className="overline">Чат поддержки</p>
          <h3>Диалог пациента с ботом и врачом</h3>
        </div>
        <span className="badge subtle">{threads.length} диалога</span>
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
              {thread.unreadByPatient ? <small>Есть новые ответы</small> : <small>Открыт</small>}
            </button>
          ))}
        </aside>

        <div className="thread-panel">
          <div className="chat-window">
            {activeThread?.messages.map((message) => (
              <div key={message.id} className={`chat-bubble ${message.author === "patient" ? "patient" : message.author === "doctor" ? "doctor" : "bot"}`}>
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
            <textarea value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Опишите симптомы, вопрос по упражнениям или самочувствие" />
            <button className="primary-action" type="submit">
              Отправить сообщение
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export default ChatAssistant;
