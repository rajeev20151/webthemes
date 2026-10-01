import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { selectCartItems } from "../store/slices/cartSlice";
import SEOHead from "../components/SEOHead";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

export default function Profile() {
  const { user } = useAuth();
  const cart = useSelector(selectCartItems);

  const firstName = user?.name?.split(" ")[0] || "User";
  const initials = (user?.name || "User")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  const details = [
    { icon: "bx-user",     label: "Full Name",  value: user?.name || "—" },
    { icon: "bx-envelope", label: "Email",      value: user?.email || "—" },
    { icon: "bx-cart",     label: "Cart Items", value: cart.length },
  ];

  return (
    <>
      <SEOHead title="My Profile" description="View and manage your profile details." />
      <section className="min-h-screen bg-[var(--color5)] py-12 sm:py-20">
        <div className="w-width">

          <BreadCrumb_Nav
            items={[
              { label: "Home",    path: "/"        },
              { label: "Profile", path: "/profile" },
            ]}
          />

          <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

            {/* ── Left: Profile Card ── */}
            <aside className="lg:sticky lg:top-28 self-start rounded-3xl overflow-hidden border border-[var(--color6)]/10 bg-[var(--color11)]">
              <div className="h-28 bg-color3 relative overflow-hidden">
                <span className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></span>
                <span className="absolute -bottom-12 -right-6 w-32 h-32 rounded-full border-[14px] border-white/10"></span>
              </div>

              <div className="relative z-10 px-6 pb-6 -mt-14 flex flex-col items-center text-center">
                  <div className="bg-color3 p-1 rounded-full shadow-xl">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[var(--color5)] p-1">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || "User"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="bg-color2 w-full h-full rounded-full text-white flex items-center justify-center fontStyle5 text-[2rem]! sm:text-[2.5rem]! font-bold tracking-wide">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="fontStyle5 font-bold text-[var(--color6)] mt-4 truncate max-w-full capitalize">
                  {user?.name || "User"}
                </h1>
                <p className="fontStyle10 text-[var(--color4)] mt-1 truncate max-w-full">
                  {user?.email || "No email"}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 fontStyle10 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active Account
                </span>

                <div className="w-full h-px bg-[var(--color6)]/10 my-6"></div>

                <div className="w-full flex flex-col gap-3">
                  <Link
                    to="/cart"
                    className="bg-color3 py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <i className="bx bx-cart text-base"></i>
                    View Cart ({cart.length})
                  </Link>
                  <Link
                    to="/templates"
                    className="py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 flex items-center justify-center gap-2 hover:border-[var(--color6)]/40 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <i className="bx bx-layout text-base"></i>
                    Browse Templates
                  </Link>
                </div>
              </div>
            </aside>

            {/* ── Right: Content ── */}
            <div className="flex flex-col gap-6 min-w-0">

              {/* Welcome */}
              <div className="rounded-3xl border border-[var(--color6)]/10 bg-[var(--color11)] p-6 sm:p-8">
                <p className="fontStyle10 font-semibold uppercase tracking-widest text-[var(--color4)]">
                  My Account
                </p>
                <h2 className="fontStyle5 font-bold text-[var(--color6)] mt-2">
                  Welcome back, <span className="capitalize">{firstName}</span>
                </h2>
                <p className="fontStyle9 text-[var(--color4)] mt-2">
                  Manage your account details and continue where you left off.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 sm:p-6 flex items-center gap-4">
                  <span className="bg-color3 w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md">
                    <i className="bx bx-shopping-bag text-2xl"></i>
                  </span>
                  <div className="min-w-0">
                    <p className="fontStyle5 font-bold text-[var(--color6)]">{cart.length}</p>
                    <p className="fontStyle10 text-[var(--color4)]">Items in Cart</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 sm:p-6 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                    <i className="bx bx-check-shield text-2xl"></i>
                  </span>
                  <div className="min-w-0">
                    <p className="fontStyle5 font-bold text-green-500">Active</p>
                    <p className="fontStyle10 text-[var(--color4)]">Account Status</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-3xl border border-[var(--color6)]/10 bg-[var(--color11)] p-6 sm:p-8">
                <h3 className="fontStyle8 font-bold text-[var(--color6)] mb-4 flex items-center gap-2">
                  <i className="bx bx-id-card text-lg"></i>
                  Account Details
                </h3>

                <div className="divide-y divide-[var(--color6)]/10">
                  {details.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-[var(--color6)]/5 text-[var(--color6)] flex items-center justify-center shrink-0">
                          <i className={`bx ${item.icon} text-lg`}></i>
                        </span>
                        <span className="fontStyle9 text-[var(--color4)]">{item.label}</span>
                      </div>
                      <span className="fontStyle9 font-semibold text-[var(--color6)] truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}