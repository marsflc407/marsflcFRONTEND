import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/utils/api";

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [resetStep, setResetStep] = useState(null);
  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const updateReset = (field) => (event) => {
    setResetForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setResetMessage("");
  };

  const openReset = () => {
    setResetStep("email");
    setResetForm({
      email: form.email,
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setResetMessage("");
  };

  const closeReset = () => {
    setResetStep(null);
    setError("");
    setResetMessage("");
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      if (resetStep === "email") {
        const response = await authAPI.requestPasswordReset({
          email: resetForm.email,
        });
        setResetMessage(
          response?.message || "Check your email for a verification code.",
        );
        setResetStep("otp");
      } else if (resetStep === "otp") {
        const response = await authAPI.verifyPasswordResetOtp({
          email: resetForm.email,
          otp: resetForm.otp,
        });
        setResetToken(response.resetToken);
        setResetStep("password");
      } else {
        if (resetForm.password !== resetForm.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const response = await authAPI.resetPassword({
          email: resetForm.email,
          resetToken,
          password: resetForm.password,
        });
        setResetMessage(response?.message || "Password updated successfully.");
        setResetStep("complete");
      }
    } catch (resetError) {
      setError(
        resetError?.response?.data?.message ||
          resetError.message ||
          "Unable to reset password.",
      );
    } finally {
      setResetLoading(false);
    }
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

        {resetStep ? (
          <form onSubmit={handleResetSubmit} className="mt-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#123B63]/10 pb-4">
              <KeyRound className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />
              <div>
                <h2 className="font-heading text-lg font-700 text-[#123B63]">
                  Change Password
                </h2>
                <p className="mt-1 text-xs text-[#123B63]/60">
                  {resetStep === "email" && "Request a verification code."}
                  {resetStep === "otp" &&
                    "Enter the 6-digit code from your email."}
                  {resetStep === "password" &&
                    "Choose a new password for your account."}
                  {resetStep === "complete" &&
                    "Your password has been changed."}
                </p>
              </div>
            </div>
            {resetStep === "email" && (
              <FormInput
                label="Admin email"
                type="email"
                name="reset-email"
                value={resetForm.email}
                onChange={updateReset("email")}
                required
                autoFocus
              />
            )}
            {resetStep === "otp" && (
              <FormInput
                label="Verification code"
                type="text"
                name="reset-otp"
                value={resetForm.otp}
                onChange={updateReset("otp")}
                required
                autoFocus
                inputMode="numeric"
                maxLength={6}
              />
            )}
            {resetStep === "password" && (
              <>
                <FormInput
                  label="New password"
                  type="password"
                  name="reset-password"
                  value={resetForm.password}
                  onChange={updateReset("password")}
                  required
                  autoFocus
                  minLength={8}
                />
                <FormInput
                  label="Confirm new password"
                  type="password"
                  name="reset-confirm-password"
                  value={resetForm.confirmPassword}
                  onChange={updateReset("confirmPassword")}
                  required
                  minLength={8}
                />
              </>
            )}
            {resetMessage && (
              <p className="border-l-2 border-[#0066D6] bg-[#0066D6]/10 px-4 py-3 text-sm text-[#0066D6]">
                {resetMessage}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="border-l-2 border-[#0066D6] bg-[#0066D6]/10 px-4 py-3 text-sm text-[#0066D6]"
              >
                {error}
              </p>
            )}
            {resetStep !== "complete" && (
              <Button type="submit" loading={resetLoading} className="w-full">
                {resetStep === "email"
                  ? "Send Code"
                  : resetStep === "otp"
                    ? "Verify Code"
                    : "Update Password"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            <button
              type="button"
              onClick={
                resetStep === "complete"
                  ? closeReset
                  : resetStep === "email"
                    ? closeReset
                    : () =>
                        setResetStep(resetStep === "password" ? "otp" : "email")
              }
              className="inline-flex items-center gap-2 text-sm text-[#123B63]/60 transition-colors hover:text-[#0066D6]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />{" "}
              {resetStep === "complete" || resetStep === "email"
                ? "Back to sign in"
                : "Back"}
            </button>
          </form>
        ) : (
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
        )}

        {!resetStep && (
          <Button
            type="button"
            variant="link"
            onClick={openReset}
            className="mt-4 w-full normal-case tracking-normal"
          >
            Change Password
          </Button>
        )}

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
