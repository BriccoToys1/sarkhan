"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminAuthToken } from "@/lib/admin-client";
import { Icons } from "@/components/admin/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.authenticated) {
        setError(data.error || "Ошибка входа");
        setLoading(false);
        return;
      }
      setAdminAuthToken(data.token || "");
      router.replace("/admin");
      window.location.assign("/admin");
    } catch {
      setError("Ошибка сети");
      setLoading(false);
    }
  };

  return (
    <div className="cms-login-wrap">
      <form onSubmit={handleSubmit} className="cms-login-card">
        <div className="cms-login-brand">
          <h1 className="cms-login-title">Sarkhan Grim</h1>
          <p className="cms-login-subtitle">Вход в админ-панель</p>
        </div>

        {error ? (
          <div className="cms-login-error">
            <Icons.close size={14} />
            {error}
          </div>
        ) : null}

        <label className="cms-label">
          Логин
          <input
            type="text"
            className="cms-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            autoFocus
            autoComplete="username"
            spellCheck={false}
          />
        </label>

        <label className="cms-label">
          Пароль
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="cms-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              className="cms-iconbtn"
              style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Скрыть" : "Показать"}
            >
              {showPassword ? <Icons.eyeOff size={16} /> : <Icons.eye size={16} />}
            </button>
          </div>
        </label>

        <button type="submit" className="cms-login-submit" disabled={loading}>
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
