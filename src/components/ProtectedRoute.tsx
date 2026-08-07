import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

type AccessState = "checking" | "granted" | "no-session" | "not-admin";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [access, setAccess] = useState<AccessState>("checking");

  useEffect(() => {
    let cancelled = false;

    // Having a session only proves the visitor owns an email address. Admin
    // access is a separate question, answered by the allowlist behind
    // is_admin(). RLS is the real boundary; this check exists so non-admins
    // see a clear message instead of a dashboard full of empty tables.
    const resolveAccess = async (hasSession: boolean): Promise<AccessState> => {
      if (!hasSession) return "no-session";

      const { data, error } = await supabase.rpc("is_admin");
      if (error) {
        console.error("Error verifying admin access:", error);
        return "not-admin";
      }
      return data === true ? "granted" : "not-admin";
    };

    const apply = async (hasSession: boolean) => {
      const next = await resolveAccess(hasSession);
      if (!cancelled) setAccess(next);
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => apply(!!session))
      .catch((error) => {
        console.error("Error checking auth:", error);
        if (!cancelled) setAccess("no-session");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void apply(!!session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (access === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1e1b4b] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (access === "no-session") {
    return <Navigate to="/admin/login" replace />;
  }

  if (access === "not-admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fc] px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 mb-4">
            <ShieldAlert className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-[#1e1b4b] mb-2">
            Not authorized
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            This account is signed in but does not have admin access.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1e1b4b] to-[#2d2a6e] text-white font-semibold hover:shadow-lg transition-all"
          >
            Sign out
          </button>
          <a
            href="/"
            className="block mt-4 text-sm text-gray-500 hover:text-[#ec4899] transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
