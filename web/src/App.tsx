import { useEffect, useMemo, useState } from "react";
import { addMember, deleteMember, fetchMembers, type Member } from "./api";

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setMembers(await fetchMembers());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await addMember({ name: name.trim(), role: role.trim() || "Member" });
      setName("");
      setRole("Member");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMember(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member.");
    }
  }

  const roleCounts = useMemo(() => {
    return members.reduce<Record<string, number>>((acc, m) => {
      acc[m.role] = (acc[m.role] ?? 0) + 1;
      return acc;
    }, {});
  }, [members]);

  return (
    <div className="app">
      <header className="hero">
        <div className="brand">
          <span className="brand-mark">J</span>
          <div>
            <h1>Jgroup</h1>
            <p>Build and manage your team roster in real time.</p>
          </div>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{members.length}</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Object.keys(roleCounts).length}</span>
            <span className="stat-label">Roles</span>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="card form-card">
          <h2>Add a member</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              <span>Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grace Hopper"
                aria-label="Member name"
              />
            </label>
            <label>
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Lead</option>
                <option>Engineer</option>
                <option>Designer</option>
                <option>Member</option>
              </select>
            </label>
            <button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Adding…" : "Add member"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2>Roster</h2>
            {loading && <span className="muted">Loading…</span>}
          </div>
          {!loading && members.length === 0 && (
            <p className="muted empty">No members yet. Add the first one!</p>
          )}
          <ul className="roster">
            {members.map((m) => (
              <li key={m.id} className="roster-item">
                <span className="avatar">{m.name.charAt(0).toUpperCase()}</span>
                <div className="roster-info">
                  <span className="roster-name">{m.name}</span>
                  <span className={`badge role-${m.role.toLowerCase()}`}>
                    {m.role}
                  </span>
                </div>
                <button
                  className="remove"
                  onClick={() => void handleDelete(m.id)}
                  aria-label={`Remove ${m.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>Jgroup · Express API + React/Vite</span>
      </footer>
    </div>
  );
}
