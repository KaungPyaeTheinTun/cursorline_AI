import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth, useToast } from "../hooks/useAuth";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const { toast } = useToast();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    const provider = searchParams.get("provider");
    const error = searchParams.get("oauth_error");

    if (error) {
      toast(decodeURIComponent(error), "error");
      navigate("/login", { replace: true });
      return;
    }

    if (token) {
      loginWithToken(token)
        .then(() => {
          toast(`Signed in with ${provider || "OAuth"} successfully!`, "success");
          navigate("/", { replace: true });
        })
        .catch(() => {
          toast("Failed to load user data.", "error");
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loginWithToken, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 mx-auto animate-spin rounded-full border-2 border-blue border-t-transparent" />
        <p className="text-sm text-muted">Completing sign-in...</p>
      </div>
    </div>
  );
}
