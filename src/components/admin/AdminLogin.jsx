import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      const destination = location.state?.from?.pathname || "/admin/dashboard";
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(
        loginError?.response?.data?.message ||
          "Unable to sign in. Check your email and password.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EFF6FF] px-4 py-12">
      <div className="w-full max-w-md border border-[#123B63]/10 bg-white p-8 shadow-xl md:p-10">
        <div className="flex h-12 w-12 items-center justify-center bg-[#123B63] text-[#0066D6]">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            MARS FLC Administration
          </p>
          <h1 className="mt-3 font-heading text-3xl font-700 text-[#123B63]">
            Sign in to continue
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
            Manage content, services, images and applications from one
            workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <FormInput
            label="Email"
            type="email"
            name="admin-email"
            value={form.email}
            onChange={update("email")}
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="admin-password"
            value={form.password}
            onChange={update("password")}
            required
          />
          {error && (
            <p
              role="alert"
              className="border-l-2 border-[#0066D6] bg-[#0066D6]/10 px-4 py-3 text-sm text-[#0066D6]"
            >
              {error}
            </p>
          )}
          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Signing In..." : "Sign In"}{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-[#123B63]/60 transition-colors hover:text-[#0066D6]"
        >
          <Mail className="h-4 w-4" aria-hidden="true" /> Return to public site
        </Link>
      </div>
    </main>
  );
}
