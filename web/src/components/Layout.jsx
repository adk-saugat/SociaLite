import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass =
  "relative rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm";

const navLinkActiveClass = "text-slate-900 bg-white/90 shadow-sm";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="sticky top-0 z-10 border-b border-slate-200/80 bg-gradient-to-r from-white via-slate-50/98 to-white backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex h-14 sm:h-16 max-w-2xl items-center justify-between px-3 sm:px-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-1.5 sm:gap-2 rounded-xl py-2 pr-1 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition-shadow group-hover:shadow-xl group-hover:shadow-blue-500/30">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all duration-300">
              Socialite
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`
              }
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16v6m3-3l-3 3-3-3m12-3v6m3-3l-3 3-3-3" />
                </svg>
                Feed
              </span>
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`
                  }
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                    {user.username}
                  </span>
                </NavLink>
                <div className="mx-2 w-px self-stretch bg-slate-200" />
                <button
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-sm px-3 py-3 flex flex-col gap-1">
            <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16v6m3-3l-3 3-3-3m12-3v6m3-3l-3 3-3-3" />
                </svg>
                Feed
              </span>
            </NavLink>
            {user ? (
              <>
                <NavLink to="/profile" onClick={closeMobileMenu} className={({ isActive }) => `${navLinkClass} ${isActive ? navLinkActiveClass : ""}`}>
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                    {user.username}
                  </span>
                </NavLink>
                <div className="my-1 h-px bg-slate-200" />
                <button onClick={handleLogout} className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu} className={navLinkClass}>
                  Log in
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg text-center">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
      <main className="mx-auto max-w-2xl px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-8">{children}</main>
    </div>
  );
}
