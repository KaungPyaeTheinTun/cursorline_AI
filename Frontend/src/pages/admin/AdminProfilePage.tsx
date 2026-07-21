import { useState, useRef, type FormEvent } from "react";
import { useAuth, useToast } from "../../hooks/useAuth";
import { useAdmin } from "../../hooks/useAdmin";
import { apiClient } from "../../lib/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const AVATAR_BASE = API_URL.replace(/\/api\/v1\/?$/, "/storage/");

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { uploadAvatar, removeAvatar } = useAdmin();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null;

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast("Image must be under 2MB.", "error");
      return;
    }
    setUploading(true);
    try {
      await uploadAvatar(file);
      await refreshUser();
      toast("Avatar updated.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload avatar.";
      toast(msg, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await removeAvatar();
      await refreshUser();
      toast("Avatar removed.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to remove avatar.";
      toast(msg, "error");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-mono text-2xl font-bold text-ink">Profile</h1>
      <p className="mt-2 text-sm text-muted">Manage your account information.</p>

      {/* Avatar + Info */}
      <div className="mt-8 flex items-center gap-5 rounded-xl border border-line bg-surface/50 p-6">
        <div className="relative group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue/20 text-blue font-mono text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            {uploading ? (
              <svg className="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
        <div className="flex-1">
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
        {avatarUrl && (
          <button
            onClick={handleAvatarRemove}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-red/50 hover:text-red"
          >
            Remove
          </button>
        )}
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
