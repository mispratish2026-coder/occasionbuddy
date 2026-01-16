"use client";

import { useNotification } from "@/context/NotificationContext";

export default function ToastNotifications() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            pointer-events-auto p-4 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in-0 duration-300
            flex items-center justify-between gap-4 min-w-80 max-w-md
            ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-blue-500 text-white"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {notification.type === "success"
                ? "✅"
                : notification.type === "error"
                ? "❌"
                : notification.type === "warning"
                ? "⚠️"
                : "ℹ️"}
            </span>
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-xl hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
