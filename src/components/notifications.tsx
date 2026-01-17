"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";

const typeConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, notifications, markNotificationRead, clearNotifications } = useAppStore();
  
  const userNotifications = currentUser 
    ? notifications.filter((n) => n.userId === currentUser.id || n.userId === "all")
    : [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600">
                <h3 className="font-semibold text-white">Notifications</h3>
                {userNotifications.length > 0 && currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => clearNotifications(currentUser.id)}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {userNotifications.map((notification) => {
                      const config = typeConfig[notification.type];
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-indigo-50/50" : ""
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(notification.createdAt), "MMM dd, h:mm a")}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
