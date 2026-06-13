import { useEffect, useRef } from "react";
import { requestFcmToken, onFcmMessage } from "../firebase";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const SALON_API = import.meta.env.VITE_SALON_API_URL;

const registerToken = async (token) => {
  try {
    const authToken = localStorage.getItem("silverscissor_token");
    await axios.post(
      `${SALON_API}/notifications/register-device`,
      { token },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
  } catch (err) {
    console.error("FCM register error:", err.message);
  }
};

const unregisterToken = async (token) => {
  try {
    const authToken = localStorage.getItem("silverscissor_token");
    await axios.delete(
      `${SALON_API}/notifications/unregister-device`,
      { headers: { Authorization: `Bearer ${authToken}` }, data: { token } }
    );
  } catch (err) {
    console.error("FCM unregister error:", err.message);
  }
};

export const useFcm = () => {
  const { addNotification } = useNotification();
  const { isAuthenticated } = useAuth();
  const tokenRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (tokenRef.current) {
        unregisterToken(tokenRef.current);
        tokenRef.current = null;
      }
      return;
    }

    const init = async () => {
      const token = await requestFcmToken();
      if (token) {
        tokenRef.current = token;
        registerToken(token);
      }
    };

    init();

    const unsubscribe = onFcmMessage((payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      addNotification(body || title || "New notification", "info", 5000);
    });

    return () => {
      unsubscribe();
      if (tokenRef.current) {
        unregisterToken(tokenRef.current);
      }
    };
  }, [isAuthenticated, addNotification]);
};
