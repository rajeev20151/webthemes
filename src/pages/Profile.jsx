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
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <>
      <SEOHead title="My Profile" description="View and manage your profile details." />
      <section className="min-h-screen bg-[var(--color5)] py-12 sm:py-20">
        <div className="w-width">

          <BreadCrumb_Nav
            items={[
              { label: "Home",    path: "/"         },
              { label: "Profile", path: "/profile"  },
            ]}
          />

          <div className="mt-10 max-w-2xl mx-auto">

            {/* ── Avatar + Name Card ── */}
            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-5">
                <span className="w-20 h-20 rounded-full bg-[var(--color6)] text-[var(--color5)] flex items-center justify-center fontStyle5 font-bold text-3xl shrink-0 uppercase">
                  {initial}
                </span>
                <div className="min-w-0">
                  <h1 className="fontStyle5 font-bold text-[var(--color6)] truncate">{user?.name || "User"}</h1>
                  <p className="fontStyle9 text-[var(--color4)] mt-1 truncate">{user?.email || "No email"}</p>
                </div>
              </div>
            </div>

            {/* ── Details Card ── */}
            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-6 sm:p-8 mb-6">
              <h2 className="fontStyle8 font-bold text-[var(--color6)] mb-5">Account Details</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--color6)]/10">
                  <span className="fontStyle9 text-[var(--color4)]">Full Name</span>
                  <span className="fontStyle9 font-semibold text-[var(--color6)]">{user?.name || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--color6)]/10">
                  <span className="fontStyle9 text-[var(--color4)]">Email</span>
                  <span className="fontStyle9 font-semibold text-[var(--color6)]">{user?.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--color6)]/10">
                  <span className="fontStyle9 text-[var(--color4)]">Cart Items</span>
                  <span className="fontStyle9 font-semibold text-[var(--color6)]">{cart.length}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="fontStyle9 text-[var(--color4)]">Account Status</span>
                  <span className="fontStyle9 font-semibold text-green-500">Active</span>
                </div>
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/cart"
                className="flex-1 py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200"
                style={{ background: "var(--color3)" }}
              >
                <i className="bx bx-cart text-base"></i>
                View Cart ({cart.length})
              </Link>
              <Link
                to="/templates"
                className="flex-1 py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 flex items-center justify-center gap-2 hover:bg-[var(--color11)] transition-colors duration-200"
              >
                <i className="bx bx-layout text-base"></i>
                Browse Templates
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
