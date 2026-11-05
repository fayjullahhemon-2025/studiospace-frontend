"use client";
import { Avatar } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";
import {
  Aperture,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  ListTree,
  LogOut,
  Menu as MenuIcon,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#howitworks", label: "How It Works" },
  { href: "/#about", label: "About Us" },
];
const accountLinks = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/studios/new", label: "Add New Studio", Icon: Plus },
  { href: "/my-studios", label: "My Studio Listings", Icon: ListTree },
  { href: "/bookings", label: "My Bookings", Icon: CalendarCheck },
];
function isActivePath(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) {
    return false;
  }
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
function linkClasses(active: boolean): string {
  return active
    ? "text-brand underline decoration-brand decoration-2 underline-offset-8"
    : "text-muted-foreground transition-colors hover:text-foreground";
}
function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="StudioSpace home"
    >
      {" "}
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand/10">
        {" "}
        <Aperture className="size-5 text-brand" />{" "}
      </span>{" "}
      <span className="flex flex-col leading-tight">
        {" "}
        <span className="text-sm font-bold tracking-[0.14em] text-foreground">
          {" "}
          STUDIOSPACE{" "}
        </span>{" "}
        <span className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {" "}
          CONVERTING SPACES INTO STAGES{" "}
        </span>{" "}
      </span>{" "}
    </Link>
  );
}
function AccountMenu() {
  const session = useSession();
  const user = session.data?.user;
  const pathname = usePathname();
  async function handleLogout() {
    await signOut();
    toast.info("You have been logged out.");
    window.setTimeout(() => {
      window.location.assign("/");
    }, 700);
  }
  if (session.isPending) {
    return <span className="size-8 animate-pulse rounded-full bg-muted" />;
  }
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {" "}
        <Link
          href="/login"
          className="rounded-lg px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {" "}
          Login{" "}
        </Link>{" "}
        <Link
          href="/signup"
          className="rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          {" "}
          Register{" "}
        </Link>{" "}
      </div>
    );
  }
  const displayName = user.name || "StudioSpace User";
  return (
    <Menu.Root>
      {" "}
      <Menu.Trigger
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-lg p-1 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {" "}
        <Avatar.Root>
          {" "}
          {user.image ? (
            <Avatar.Image
              referrerPolicy="no-referrer"
              src={user.image}
              alt={displayName}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <Avatar.Fallback className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
              {" "}
              {displayName
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("")}{" "}
            </Avatar.Fallback>
          )}{" "}
        </Avatar.Root>{" "}
        <span className="hidden max-w-32 truncate text-sm font-medium text-foreground md:inline">
          {" "}
          {displayName}{" "}
        </span>{" "}
        <ChevronDown className="size-3.5 text-muted-foreground" />{" "}
      </Menu.Trigger>{" "}
      <Menu.Portal>
        {" "}
        <Menu.Positioner align="end" sideOffset={8}>
          {" "}
          <Menu.Popup className="z-50 w-64 origin-[var(--transform-origin)] rounded-xl border border-border bg-popover p-1.5 shadow-lg outline-none">
            {" "}
            <Menu.Group>
              {" "}
              <Menu.GroupLabel className="border-b border-border px-2.5 pb-2">
                {" "}
                <span className="block truncate text-sm font-semibold text-foreground">
                  {" "}
                  {displayName}{" "}
                </span>{" "}
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {" "}
                  {user.email}{" "}
                </span>{" "}
              </Menu.GroupLabel>{" "}
              <div className="mt-1.5 flex flex-col">
                {" "}
                {accountLinks.map(({ href, label, Icon }) => (
                  <Menu.LinkItem
                    key={href}
                    render={<Link href={href} />}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-muted ${isActivePath(pathname, href) ? "font-semibold text-brand" : "text-foreground"}`}
                  >
                    {" "}
                    <Icon className="size-4 text-muted-foreground" /> {
                      label
                    }{" "}
                  </Menu.LinkItem>
                ))}{" "}
              </div>{" "}
            </Menu.Group>{" "}
            <div className="mx-1 my-1 h-px bg-border" />{" "}
            <Menu.Item
              onClick={handleLogout}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive outline-none transition-colors data-[highlighted]:bg-destructive/10"
            >
              {" "}
              <LogOut className="size-4" /> Logout{" "}
            </Menu.Item>{" "}
          </Menu.Popup>{" "}
        </Menu.Positioner>{" "}
      </Menu.Portal>{" "}
    </Menu.Root>
  );
}
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mountedPath, setMountedPath] = useState(pathname);
  if (mountedPath !== pathname) {
    setMountedPath(pathname);
    setMobileOpen(false);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {" "}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {" "}
        <Brand />{" "}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {" "}
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium ${linkClasses(active)}`}
              >
                {" "}
                {link.label}{" "}
              </Link>
            );
          })}{" "}
        </nav>{" "}
        <div className="flex items-center gap-2">
          {" "}
          <div className="hidden lg:block">
            {" "}
            <AccountMenu />{" "}
          </div>{" "}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {" "}
            {mobileOpen ? (
              <X className="size-4.5" />
            ) : (
              <MenuIcon className="size-4.5" />
            )}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background px-4 pt-2 pb-4 lg:hidden"
        >
          {" "}
          <nav aria-label="Primary mobile" className="flex flex-col">
            {" "}
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-2 py-2.5 text-sm font-medium ${active ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {" "}
                  {link.label}{" "}
                </Link>
              );
            })}{" "}
          </nav>{" "}
          <div className="mt-2 border-t border-border pt-3">
            {" "}
            <AccountMenu />{" "}
          </div>{" "}
        </div>
      ) : null}{" "}
    </header>
  );
}
export default Navbar;
