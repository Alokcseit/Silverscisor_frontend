importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const params = new URL(self.location.href).searchParams;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();

const NOTIFICATION_OPTIONS = {
  icon: "/logo.png",
  badge: "/logo.png",
  sound: "/notification.wav",
  vibrate: [200, 100, 200, 100, 200],
  requireInteraction: true,
  silent: false,
  tag: "silverscisor-default",
  renotify: true,
};

self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      const { notification, data } = payload;
      if (notification) {
        event.waitUntil(
          self.registration.showNotification(notification.title || "Silverscisor", {
            ...NOTIFICATION_OPTIONS,
            body: notification.body || "",
            image: notification.image || undefined,
            data: data || {},
            tag: data?.tag || `silverscisor-${Date.now()}`,
          })
        );
      }
    } catch (e) {
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification("Silverscisor", {
          ...NOTIFICATION_OPTIONS,
          body: text,
          tag: `silverscisor-raw-${Date.now()}`,
        })
      );
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const data = payload.data || {};
  self.registration.showNotification(title || "Silverscisor", {
    ...NOTIFICATION_OPTIONS,
    body: body || "",
    data: data,
    tag: data?.tag || `silverscisor-bg-${Date.now()}`,
  });
});
