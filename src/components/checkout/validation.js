/* ── Luhn checksum ── */
const luhn = (n) => {
  let s = 0, alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    s += d; alt = !alt;
  }
  return s % 10 === 0;
};

/* ── Validators ── */
export const validate = {
  info: (f) => {
    const e = {};
    if (!f.firstName.trim())                               e.firstName = "First name is required";
    else if (!/^[a-zA-Z\s]{2,}$/.test(f.firstName.trim())) e.firstName = "Only letters allowed, min 2 chars";
    if (!f.lastName.trim())                                e.lastName  = "Last name is required";
    else if (!/^[a-zA-Z\s]{2,}$/.test(f.lastName.trim()))  e.lastName  = "Only letters allowed, min 2 chars";
    if (!f.email.trim())                                   e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email     = "Enter a valid email address";
    if (!f.country)                                        e.country   = "Please select a country";
    return e;
  },
  card: (f) => {
    const e = {};
    const num = f.cardNumber.replace(/\s/g, "");
    if (!num)                        e.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(num))  e.cardNumber = "Enter a valid 16-digit card number";
    else if (!luhn(num))             e.cardNumber = "Invalid card number";

    if (!f.cardName.trim())                               e.cardName = "Cardholder name is required";
    else if (!/^[a-zA-Z\s]{3,}$/.test(f.cardName.trim())) e.cardName = "Enter full name as on card (letters only)";

    if (!f.expiry.trim()) {
      e.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) {
      e.expiry = "Use MM/YY format";
    } else {
      const [mm, yy] = f.expiry.split("/").map(Number);
      const now = new Date();
      const exp = new Date(2000 + yy, mm - 1, 1);
      if (exp < new Date(now.getFullYear(), now.getMonth(), 1)) e.expiry = "Card has expired";
    }

    if (!f.cvv.trim())              e.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = "Enter a valid 3 or 4 digit CVV";
    return e;
  },
  upi: (f) => {
    const e = {};
    if (!f.upiId.trim())                                    e.upiId = "UPI ID is required";
    else if (!/^[\w.\-_]{3,}@[a-zA-Z]{2,}$/.test(f.upiId)) e.upiId = "Enter a valid UPI ID (e.g. name@upi)";
    return e;
  },
};

/* ── Input formatters ── */
export const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

export const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};
