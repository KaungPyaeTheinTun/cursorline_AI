import { useState, type FormEvent } from "react";
import { useAuth, useToast } from "../../hooks/useAuth";
import { apiClient } from "../../lib/axios";

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put("/me", { name, email });
      await refreshUser();
      toast("Profile updated.", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update profile.";
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-mono text-2xl font-bold text-ink">Profile</h1>
      <p className="mt-2 text-sm text-muted">Manage your account information.</p>

      {/* Avatar + Info */}
      <div className="mt-8 flex items-center gap-5 rounded-xl border border-line bg-surface/50 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue/20 text-blue font-mono text-xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-mono text-lg font-bold text-ink">{user?.name}</h2>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue capitalize">
              {user?.roles?.[0] || "user"}
            </span>
            {user?.subscribed_at && (
              <span className="rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-medium text-green">
                Pro
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <h3 className="font-mono text-sm font-semibold text-ink">Edit Profile</h3>
        <div>
          <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Account info */}
      <div className="mt-10 rounded-xl border border-line bg-surface/50 p-6">
        <h3 className="font-mono text-sm font-semibold text-ink mb-4">Account Details</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">User ID</dt>
            <dd className="font-mono text-ink">{user?.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Role</dt>
            <dd className="text-ink capitalize">{user?.roles?.[0] || "user"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Provider</dt>
            <dd className="text-ink">{user?.provider || "Email"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Subscription</dt>
            <dd className="text-ink">{user?.subscribed_at ? "Pro" : "Free"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
