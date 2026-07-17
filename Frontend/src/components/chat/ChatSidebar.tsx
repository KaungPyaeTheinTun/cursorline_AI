import { useState, useCallback } from "react";
import type { Conversation } from "../../hooks/useConversations";
import Tooltip from "../ui/Tooltip";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

interface ChatSidebarProps {
  readonly conversations: readonly Conversation[];
  readonly activeId: number | null;
  readonly onSelect: (id: number) => void;
  readonly onNewChat: () => void;
  readonly onDelete: (id: number) => void;
  readonly collapsed: boolean;
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  collapsed,
}: ChatSidebarProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setPendingDeleteId(id);
    },
    [],
  );

  const confirmDelete = useCallback(() => {
    if (pendingDeleteId !== null) {
      onDelete(pendingDeleteId);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, onDelete]);

  return (
    <div className="relative h-full w-full">
      {/* ── Expanded view ── */}
      <div
        className={`absolute inset-0 flex flex-col border-r border-line bg-surface transition-opacity duration-200 ${
          collapsed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface2"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {conversations.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted">
              No conversations yet.
            </p>
          )}

          {conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => onSelect(convo.id)}
              className={`group mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                convo.id === activeId
                  ? "bg-blue/10 text-ink"
                  : "text-muted hover:bg-surface2 hover:text-ink"
              }`}
            >
              <MessageIcon />
              <span className="flex-1 truncate">{convo.title}</span>
              <span
                onClick={(e) => handleDeleteClick(e, convo.id)}
                className="rounded p-1 text-muted opacity-0 transition-opacity duration-150 hover:text-red group-hover:opacity-100"
              >
                <TrashIcon />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Collapsed view ── */}
      <div
        className={`absolute inset-0 flex flex-col items-center border-r border-line bg-surface py-3 transition-opacity duration-200 ${
          collapsed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Tooltip content="New Chat" side="right">
          <button
            onClick={onNewChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface2 hover:text-ink"
          >
            <PlusIcon />
          </button>
        </Tooltip>

        <div className="h-px w-6 bg-line" />

        <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto pt-1">
          {conversations.map((convo) => (
            <div key={convo.id} className="relative">
              <Tooltip
                content={
                  <span className="flex items-center gap-1.5">
                    <span className="truncate max-w-[140px]">{convo.title}</span>
                    <span
                      onClick={(e) => handleDeleteClick(e, convo.id)}
                      className="ml-1 shrink-0 cursor-pointer rounded p-0.5 text-muted hover:text-red"
                    >
                      <TrashIcon />
                    </span>
                  </span>
                }
                side="right"
              >
                <button
                  onClick={() => onSelect(convo.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    convo.id === activeId
                      ? "bg-blue/10 text-ink"
                      : "text-muted hover:bg-surface2 hover:text-ink"
                  }`}
                >
                  <MessageIcon />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      <DeleteConfirmModal
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
