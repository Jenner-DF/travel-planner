"use client";

import { signInGithub, signInGoogle, signOut } from "./actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";

// Custom Google Icon
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="#4285F4"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.52 2.53 29.3 0 24 0 14.7 0 6.48 5.82 2.56 14.19l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.1 24.55c0-1.57-.14-3.07-.41-4.55H24v9.02h12.41c-.54 2.89-2.17 5.34-4.62 6.98l7.41 5.77c4.33-4 6.9-9.88 6.9-17.22z"
      />
      <path
        fill="#FBBC05"
        d="M10.54 28.38a14.5 14.5 0 0 1-.76-4.38c0-1.52.27-2.98.76-4.38l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.94.94 7.66 2.56 10.95l7.98-6.57z"
      />
      <path
        fill="#EA4335"
        d="M24 48c6.48 0 11.91-2.13 15.87-5.79l-7.41-5.77c-2.05 1.39-4.7 2.21-8.46 2.21-6.26 0-11.57-4.22-13.46-9.95l-7.98 6.57C6.48 42.18 14.7 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Plan your Travels with us! 👋
          </CardTitle>
          <CardDescription>Sign in to continue to your account</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={async () => await signInGoogle()}
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={async () => await signInGithub()}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
