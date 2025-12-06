"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import { LogOutIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AvatarDropdown } from "./avatar-dropdown";

export function Header() {
  const { user } = useUser();
  const clerk = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-[2000] bg-background/80 backdrop-blur-xl border-b border-border/50">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <nav className="container flex h-16 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300"
          >
            {/* Custom organic logo mark */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-shadow duration-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="m4.93 4.93 2.83 2.83" />
                  <path d="m16.24 16.24 2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="m4.93 19.07 2.83-2.83" />
                  <path d="m16.24 7.76 2.83-2.83" />
                </svg>
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
            </div>
            <span className="font-display text-lg font-medium tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
              {Constants.APP_NAME}
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button
          className="md:hidden hover:bg-accent/50"
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>

        {/* Desktop auth section */}
        <div className="hidden md:flex md:items-center gap-4 text-foreground">
          <SignedIn>
            <AvatarDropdown
              fullName={user?.fullName}
              imageUrl={user?.imageUrl}
              email={user?.emailAddresses[0].emailAddress}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="rounded-full px-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl py-4 px-6 border-t border-border/50 animate-fade-in-up">
          <div className="flex flex-col gap-3 items-center w-full">
            <SignedIn>
              <Button
                variant="ghost"
                className="w-full justify-center rounded-full hover:bg-accent/50 py-6"
                onClick={() => {
                  clerk.signOut();
                  toggleMobileMenu();
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="w-full justify-center rounded-full py-6 shadow-soft">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
