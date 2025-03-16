
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', protected: true },
    { name: 'Profile', path: '/profile', protected: true },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl">AiReplyr</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-foreground/80 ${
                  location.pathname === link.path ? 'text-foreground font-medium' : 'text-foreground/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground">
                  <User size={18} />
                  {user.username}
                </Link>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>AiReplyr</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6">
              {filteredLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg ${
                    location.pathname === link.path ? 'text-foreground font-medium' : 'text-foreground/60'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 text-foreground/60 hover:text-foreground"
                    onClick={closeMobileMenu}
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild onClick={closeMobileMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={closeMobileMenu}>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
