import {
  ArrowRight, Check, Headphones, Loader2, Menu, Minus, Plus, PlusIcon,
  Search, ShieldCheck, ShoppingCart, TruckIcon, User, X,
} from 'lucide-react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import instance from '../utils/axios';

/* ============================================================
   STATIONARY. — kraft-paper & ink themed art-supplies storefront
   Wired to the real backend: /api/stationery-products, /api/cart
   and /api/stationery-orders. Add to cart requires login; checkout
   supports Pay Online (Razorpay) and Pay Offline (cash on delivery).
   ============================================================ */

// The Razorpay Checkout script isn't loaded anywhere globally, so it has
// to be injected on demand before window.Razorpay is usable.
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const artSupplyTiles = [
  { id: 'a1', name: 'Paints & Pigments', img: 'paints-tile-1' },
  { id: 'a2', name: 'Brushes & Tools', img: 'brushes-tile-2' },
  { id: 'a3', name: 'Canvas & Boards', img: 'canvas-tile-3' },
  { id: 'a4', name: 'Sketchbooks', img: 'sketchbook-tile-4' },
  { id: 'a5', name: 'Easels & Stands', img: 'easel-tile-5' },
  { id: 'a6', name: 'Palette Knives', img: 'palette-tile-6' },
];

const craftSupplyTiles = [
  { id: 'cr1', name: 'Scissors & Cutters', img: 'scissors-tile-1' },
  { id: 'cr2', name: 'Glue & Adhesives', img: 'glue-tile-2' },
  { id: 'cr3', name: 'Beads & Charms', img: 'beads-tile-3' },
  { id: 'cr4', name: 'Felt Sheets', img: 'felt-tile-4' },
  { id: 'cr5', name: 'Pom Poms', img: 'pompom-tile-5' },
  { id: 'cr6', name: 'Origami Paper', img: 'origami-tile-6' },
];

// ---------- Small presentational helpers ----------
const imgUrl = (seed, w = 400, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const ProductCard = ({ product, onAdd, justAdded, adding }) => {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;
  const outOfStock = !product.inStock;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {(discount || outOfStock) && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white shadow ${outOfStock ? 'bg-ink-500' : 'bg-berry-600'
            }`}
        >
          {outOfStock ? 'Out of stock' : `-${discount}%`}
        </span>
      )}
      <div className="relative aspect-square w-full overflow-hidden bg-paper-200">
        <img
          src={product.image || imgUrl(product._id)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-sm font-semibold leading-snug text-ink-900">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink-900">{money(product.price)}</span>
          {product.oldPrice > product.price && (
            <span className="text-xs text-ink-400 line-through">{money(product.oldPrice)}</span>
          )}
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={outOfStock || adding}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-ink-900 py-2 text-xs font-semibold uppercase tracking-wide text-paper-50 transition hover:bg-berry-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : justAdded ? (
            <>
              <Check size={14} /> Added
            </>
          ) : outOfStock ? (
            'Out of stock'
          ) : (
            <>
              <PlusIcon size={14} /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const CategoryTile = ({ item }) => (
  <div className="group flex flex-col items-center gap-3 text-center">
    <span className="relative block h-24 w-24 overflow-hidden rounded-full border-2 border-paper-300 shadow-sm transition group-hover:ring-4 group-hover:ring-marigold-200 sm:h-28 sm:w-28">
      <img
        src={imgUrl(item.img, 200, 200)}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
    </span>
    <span className="text-xs font-semibold text-ink-700 sm:text-sm">{item.name}</span>
  </div>
);

const TrustBadge = ({ Icon, title, desc }) => (
  <div className="flex flex-col items-center gap-3 px-6 text-center sm:flex-row sm:text-left">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-moss-100 text-moss-700">
      <Icon size={22} />
    </span>
    <div>
      <h4 className="font-display text-sm font-semibold text-ink-900">{title}</h4>
      <p className="text-xs text-ink-500">{desc}</p>
    </div>
  </div>
);

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10 flex flex-col items-center text-center">
    {eyebrow && <span className="font-script mb-1 text-2xl text-marigold-600">{eyebrow}</span>}
    <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
      {title}
    </h2>
    {subtitle && <p className="mt-2 max-w-xl text-sm text-ink-500">{subtitle}</p>}
    <span className="mt-4 h-[3px] w-16 rounded-full bg-berry-600" />
  </div>
);

// ---------- Main component ----------
const Stationary = () => {
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [addingId, setAddingId] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);
  const [query, setQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const addTimeout = useRef(null);

  // Checkout
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shipping, setShipping] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${accessToken}` } };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await instance.get('/stationery-products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCart = async () => {
    if (!accessToken) return;
    setCartLoading(true);
    try {
      const { data } = await instance.get('/cart', authHeaders);
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accessToken) fetchCart();
    else setCart({ items: [], totalItems: 0, totalAmount: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (user?.name) {
      setShipping((s) => (s.name ? s : { ...s, name: user.name }));
    }
  }, [user]);

  useEffect(() => () => clearTimeout(addTimeout.current), []);

  const handleAddToCart = async (product) => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    setAddingId(product._id);
    try {
      const { data } = await instance.post(
        '/cart/add',
        { productId: product._id, quantity: 1 },
        authHeaders
      );
      setCart(data);
      setJustAddedId(product._id);
      clearTimeout(addTimeout.current);
      addTimeout.current = setTimeout(() => setJustAddedId(null), 1400);
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not add this item to your cart.');
    } finally {
      setAddingId(null);
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const { data } = await instance.put('/cart/update', { productId, quantity }, authHeaders);
      setCart(data);
    } catch (err) {
      console.error('Failed to update cart', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await instance.delete(`/cart/remove/${productId}`, authHeaders);
      setCart(data);
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutError('');
    setConfirmedOrder(null);
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async () => {
    setCheckoutError('');
    if (!shipping.name || !shipping.phone || !shipping.address) {
      setCheckoutError('Please fill in your name, phone number and delivery address.');
      return;
    }

    setPlacingOrder(true);
    try {
      if (paymentMethod === 'offline') {
        const { data } = await instance.post('/stationery-orders/offline', shipping, authHeaders);
        setConfirmedOrder(data.order);
        setCart({ items: [], totalItems: 0, totalAmount: 0 });
        setPlacingOrder(false);
        return;
      }

      // Online payment via Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError('Could not load the payment gateway. Please check your connection and try again.');
        setPlacingOrder(false);
        return;
      }

      const { data: orderData } = await instance.post(
        '/stationery-orders/create-online-order',
        shipping,
        authHeaders
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Stationary.',
        description: 'Stationery order',
        order_id: orderData.orderId,
        prefill: {
          name: shipping.name,
          contact: shipping.phone,
          email: user?.email || '',
        },
        theme: { color: '#A8354B' },
        handler: async (response) => {
          try {
            const { data: verifyData } = await instance.post(
              '/stationery-orders/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              authHeaders
            );
            setConfirmedOrder(verifyData.order);
            setCart({ items: [], totalItems: 0, totalAmount: 0 });
          } catch (err) {
            setCheckoutError(
              err?.response?.data?.message ||
              'Payment was completed, but verification failed. Please contact support.'
            );
          } finally {
            setPlacingOrder(false);
          }
        },
        modal: { ondismiss: () => setPlacingOrder(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setCheckoutError('Payment failed. Please try again.');
        setPlacingOrder(false);
      });
      rzp.open();
    } catch (err) {
      setCheckoutError(err?.response?.data?.message || 'Something went wrong placing your order.');
      setPlacingOrder(false);
    }
  };

  const closeCheckout = () => {
    if (placingOrder) return;
    setCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  const saleProducts = useMemo(() => products.filter((p) => p.onSale), [products]);
  const giftProducts = useMemo(() => products.filter((p) => p.isGift), [products]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, products]);

  const navLinks = [
    { label: 'Sale', href: '#clearance' },
    { label: 'Gifts', href: '#gifts' },
    { label: 'All Products', href: '#all-products' },
    { label: 'Art Supplies', href: '#art-supplies' },
    { label: 'Craft Supplies', href: '#craft-supplies' },
  ];

  const renderProductGrid = (list, colsClass = 'sm:grid-cols-3 lg:grid-cols-6') => (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 ${colsClass}`}>
      {list.map((p) => (
        <ProductCard
          key={p._id}
          product={p}
          onAdd={handleAddToCart}
          justAdded={justAddedId === p._id}
          adding={addingId === p._id}
        />
      ))}
    </div>
  );

  return (
    <div className="font-body min-h-screen bg-paper-50 text-ink-900 mt-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Caveat:wght@600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        :root{
          --paper-50:#FBF8EF; --paper-100:#F4EEDB; --paper-200:#EAE0C1; --paper-300:#DCCE9F;
          --ink-900:#232B3B; --ink-700:#3A4257; --ink-500:#5C6478; --ink-400:#7B8296; --ink-200:#C6CAD4; --ink-100:#E3E5EA;
          --marigold-500:#E2A93B; --marigold-600:#CE9527; --marigold-100:#F8E7C4; --marigold-200:#F1DAA1;
          --moss-700:#4B6142; --moss-100:#E1E8D9;
          --berry-600:#A8354B; --berry-700:#8E2A3E;
        }
        .font-display{ font-family:'Fraunces', ui-serif, serif; }
        .font-script{ font-family:'Caveat', cursive; }
        .font-body{ font-family:'Work Sans', ui-sans-serif, system-ui, sans-serif; }
        .bg-paper-50{background-color:var(--paper-50);} .bg-paper-100{background-color:var(--paper-100);}
        .bg-paper-200{background-color:var(--paper-200);} .bg-paper-300{background-color:var(--paper-300);}
        .text-ink-900{color:var(--ink-900);} .text-ink-700{color:var(--ink-700);} .text-ink-500{color:var(--ink-500);}
        .text-ink-400{color:var(--ink-400);} .bg-ink-900{background-color:var(--ink-900);} .border-ink-100{border-color:var(--ink-100);}
        .border-ink-200{border-color:var(--ink-200);} .text-ink-200{color:var(--ink-200);}
        .text-marigold-500{color:var(--marigold-500);} .text-marigold-600{color:var(--marigold-600);}
        .fill-marigold-500{fill:var(--marigold-500);} .bg-marigold-100{background-color:var(--marigold-100);}
        .bg-marigold-200{background-color:var(--marigold-200);} .bg-marigold-500{background-color:var(--marigold-500);}
        .hover\\:bg-marigold-500:hover{background-color:var(--marigold-500);}
        .text-moss-700{color:var(--moss-700);} .bg-moss-100{background-color:var(--moss-100);}
        .bg-berry-600{background-color:var(--berry-600);} .bg-berry-700{background-color:var(--berry-700);}
        .hover\\:bg-berry-700:hover{background-color:var(--berry-700);} .text-berry-600{color:var(--berry-600);}
        .group:hover .group-hover\\:ring-marigold-200{--tw-ring-color:var(--marigold-200);}
        .text-paper-50{color:var(--paper-50);}
        @media (prefers-reduced-motion: reduce){ *{animation:none!important; transition:none!important;} }
      `}</style>

      {/* Announcement bar */}
      <div className="bg-ink-900 py-2 text-center text-xs font-medium tracking-wide text-paper-50">
        Free shipping worldwide on orders over ₹999 · Use code&nbsp;
        <span className="text-marigold-500">PAPER10</span>&nbsp;for 10% off
      </div>

      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            className="mr-1 rounded-md p-2 text-ink-700 hover:bg-paper-200 lg:hidden"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a href="#top" className="font-display flex items-center gap-1 text-2xl font-bold text-ink-900">
            Stationary<span className="text-marigold-500">.</span>
          </a>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-ink-700 transition hover:text-berry-600"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search paints, journals, washi tape..."
              className="w-full rounded-full border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-marigold-500 focus:ring-2"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg">
                {searchResults.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setQuery(p.name)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-paper-100"
                  >
                    <img src={p.image || imgUrl(p._id, 60, 60)} alt="" className="h-9 w-9 rounded-md object-cover" />
                    <span className="flex-1 truncate text-ink-800">{p.name}</span>
                    <span className="text-xs font-semibold text-ink-500">{money(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-4">
            <button
              onClick={() => (accessToken ? navigate('/user-dashboard') : navigate('/login'))}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-700 hover:bg-paper-200"
            >
              <User size={19} />
              <span className="hidden sm:inline">{user?.name ? user.name.split(' ')[0] : 'Login'}</span>
            </button>
            <button
              onClick={() => (accessToken ? setCartOpen(true) : navigate('/login'))}
              className="relative rounded-full p-2 text-ink-700 hover:bg-paper-200"
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              {cart.totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-berry-600 px-1 text-[10px] font-bold text-white">
                  {cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-ink-100 bg-paper-50 px-4 pb-4 pt-3 lg:hidden">
            <div className="relative mb-3">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-marigold-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm font-medium text-ink-700 hover:bg-paper-200"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ---------- Hero ---------- */}
      <section id="top" className="relative overflow-hidden bg-paper-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="font-script text-3xl text-marigold-600">every page deserves colour</span>
            <h1 className="font-display mt-2 text-4xl font-semibold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Fill your world with
              <br />
              <span className="text-berry-600">handmade</span> moments.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500 sm:text-base">
              Curated paints, journals, and craft essentials for people who'd
              rather make something than scroll past it. Sourced for texture,
              packed with care, shipped worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#clearance"
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-berry-700"
              >
                Shop the sale
              </a>
              <a
                href="#all-products"
                className="flex items-center gap-1.5 rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-800 transition hover:border-berry-600 hover:text-berry-600"
              >
                Explore all products <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
            <div className="absolute left-2 top-4 h-52 w-40 rotate-[-6deg] rounded-md bg-white p-2 shadow-xl sm:h-60 sm:w-48">
              <img src={imgUrl('hero-collage-1', 300, 360)} alt="Watercolour palette" className="h-full w-full rounded object-cover" />
            </div>
            <div className="absolute right-0 top-0 h-40 w-36 rotate-[8deg] rounded-md bg-white p-2 shadow-xl sm:h-48 sm:w-44">
              <img src={imgUrl('hero-collage-2', 260, 220)} alt="Journal flatlay" className="h-full w-full rounded object-cover" />
            </div>
            <div className="absolute bottom-0 left-16 h-32 w-40 rotate-[3deg] rounded-md bg-white p-2 shadow-xl sm:h-36 sm:w-48">
              <img src={imgUrl('hero-collage-3', 280, 200)} alt="Craft supplies" className="h-full w-full rounded object-cover" />
            </div>
          </div>
        </div>
      </section>

      {loadingProducts ? (
        <div className="flex items-center justify-center py-24 text-ink-400">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center text-ink-500">
          No stationery products are available right now — check back soon.
        </div>
      ) : (
        <>
          {/* ---------- Stock Clearance Sale ---------- */}
          {saleProducts.length > 0 && (
            <section id="clearance" className="bg-paper-50 py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <SectionHeading
                  eyebrow="limited stock"
                  title="STOCK CLEARANCE SALE"
                  subtitle="Best-loved supplies at a discount — once these are gone, they're gone."
                />
                {renderProductGrid(saleProducts)}
              </div>
            </section>
          )}

          {/* ---------- Gifting Kits ---------- */}
          {giftProducts.length > 0 && (
            <section id="gifts" className="bg-paper-100 py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <SectionHeading eyebrow="wrapped with care" title="Gifting Kits" subtitle="Ready-to-give bundles for the maker in your life." />
                {renderProductGrid(giftProducts, 'lg:grid-cols-4')}
              </div>
            </section>
          )}

          {/* ---------- All Products ---------- */}
          <section id="all-products" className="bg-paper-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="the full shelf" title="All Products" subtitle="Everything in the studio, in one place." />
              {renderProductGrid(products, 'lg:grid-cols-4')}
            </div>
          </section>

          {/* ---------- Art Supplies (category browse) ---------- */}
          <section id="art-supplies" className="bg-paper-100 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="the essentials" title="ART SUPPLIES" subtitle="Paints, brushes, and surfaces for every medium." />
              <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-6">
                {artSupplyTiles.map((t) => (
                  <CategoryTile key={t.id} item={t} />
                ))}
              </div>
            </div>
          </section>

          {/* ---------- Craft Supplies (category browse) ---------- */}
          <section id="craft-supplies" className="bg-paper-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <SectionHeading eyebrow="hands-on making" title="CRAFT SUPPLIES" subtitle="Everything for cutting, sticking, and building." />
              <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-6">
                {craftSupplyTiles.map((t) => (
                  <CategoryTile key={t.id} item={t} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ---------- Trust badges ---------- */}
      <section className="border-y border-ink-100 bg-paper-50 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6">
          <TrustBadge
            Icon={TruckIcon}
            title="Standard Shipping Worldwide"
            desc="Every order is packed by hand and shipped from our studio to your door, wherever you are."
          />
          <TrustBadge
            Icon={ShieldCheck}
            title="100% Safe & Secure Checkout"
            desc="Your payment details stay encrypted end-to-end — we never store your card information."
          />
          <TrustBadge
            Icon={Headphones}
            title="24/7 Online Support"
            desc="Questions about an order or a supply? Our team replies day or night, every day of the week."
          />
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-ink-900 pt-14 text-ink-200">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 pb-10 sm:grid-cols-4 sm:px-6">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-xl font-bold text-paper-50">
              Stationary<span className="text-marigold-500">.</span>
            </span>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Art, craft, and journaling supplies picked for texture and made
              to be used, not just kept on a shelf.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#top" aria-label="Instagram" className="rounded-full bg-ink-700/60 p-2 hover:bg-marigold-500 hover:text-ink-900">
                <FaInstagram size={15} />
              </a>
              <a href="#top" aria-label="Facebook" className="rounded-full bg-ink-700/60 p-2 hover:bg-marigold-500 hover:text-ink-900">
                <FaFacebook size={15} />
              </a>
              <a href="#top" aria-label="Twitter" className="rounded-full bg-ink-700/60 p-2 hover:bg-marigold-500 hover:text-ink-900">
                <FaTwitter size={15} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-display mb-3 text-sm font-semibold text-paper-50">Shop</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#clearance" className="hover:text-marigold-500">Clearance Sale</a></li>
              <li><a href="#gifts" className="hover:text-marigold-500">Gifting Kits</a></li>
              <li><a href="#all-products" className="hover:text-marigold-500">All Products</a></li>
              <li><a href="#art-supplies" className="hover:text-marigold-500">Art Supplies</a></li>
              <li><a href="#craft-supplies" className="hover:text-marigold-500">Craft Supplies</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-display mb-3 text-sm font-semibold text-paper-50">Help</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#top" className="hover:text-marigold-500">Shipping & returns</a></li>
              <li><a href="#top" className="hover:text-marigold-500">FAQs</a></li>
              <li><a href="#top" className="hover:text-marigold-500">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-display mb-3 text-sm font-semibold text-paper-50">Studio</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#top" className="hover:text-marigold-500">Our story</a></li>
              <li><a href="#top" className="hover:text-marigold-500">Sustainability</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-700/60 py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-[11px] text-ink-400 sm:flex-row sm:px-6">
            <span>© {new Date().getFullYear()} Stationary. All rights reserved.</span>
            <span>Made for people who still write things down.</span>
          </div>
        </div>
      </footer>

      {/* ---------- Cart Drawer ---------- */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/60" onClick={() => setCartOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col bg-paper-50 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-ink-900">Your Cart</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-full p-1.5 text-ink-500 hover:bg-paper-200" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartLoading ? (
                <div className="flex justify-center py-10 text-ink-400"><Loader2 className="animate-spin" /></div>
              ) : cart.items.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink-500">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex gap-3 rounded-xl border border-ink-100 bg-white p-3">
                      <img
                        src={item.product.image || imgUrl(item.product._id, 80, 80)}
                        alt={item.product.name}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-semibold text-ink-900">{item.product.name}</p>
                        <p className="text-xs text-ink-500">{money(item.product.price)} each</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-ink-200 px-2 py-1">
                            <button onClick={() => updateQty(item.product._id, item.quantity - 1)} className="text-ink-600 hover:text-berry-600">
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQty(item.product._id, item.quantity + 1)} className="text-ink-600 hover:text-berry-600">
                              <Plus size={13} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.product._id)} className="text-xs font-semibold text-berry-600 hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-ink-900">{money(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-ink-100 px-5 py-4">
                <div className="mb-4 flex items-center justify-between text-sm font-semibold text-ink-900">
                  <span>Total</span>
                  <span>{money(cart.totalAmount)}</span>
                </div>
                <button onClick={openCheckout} className="w-full rounded-full bg-ink-900 py-3 text-sm font-semibold text-paper-50 transition hover:bg-berry-700">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Checkout Modal ---------- */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4" onClick={closeCheckout}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-paper-50 p-6 shadow-2xl">
            {confirmedOrder ? (
              <div className="text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 text-moss-700">
                  <Check size={28} />
                </span>
                <h3 className="font-display text-xl font-semibold text-ink-900">Order Placed!</h3>
                <p className="mt-2 text-sm text-ink-500">
                  {confirmedOrder.paymentMode === 'offline'
                    ? "Your order is confirmed. Pay in cash when it's delivered."
                    : 'Payment received — your order is confirmed.'}
                </p>
                <div className="mt-4 rounded-xl border border-ink-100 bg-white p-4 text-left text-sm text-ink-700">
                  <p><span className="font-semibold">Delivering to:</span> {confirmedOrder.shipping?.name}, {confirmedOrder.shipping?.phone}</p>
                  <p className="mt-1 text-ink-500">{confirmedOrder.shipping?.address}</p>
                  <p className="mt-2 font-semibold text-ink-900">Total: {money(confirmedOrder.amount / 100)}</p>
                </div>
                <button
                  onClick={() => { setCheckoutOpen(false); setConfirmedOrder(null); }}
                  className="mt-6 w-full rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-paper-50 transition hover:bg-berry-700"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-ink-900">Delivery details</h3>
                  <button onClick={closeCheckout} className="rounded-full p-1 text-ink-500 hover:bg-paper-200" aria-label="Close">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-ink-700">
                    Full name
                    <input
                      value={shipping.name}
                      onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-marigold-500"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="text-xs font-medium text-ink-700">
                    Phone number
                    <input
                      value={shipping.phone}
                      onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-marigold-500"
                      placeholder="10-digit mobile number"
                    />
                  </label>
                  <label className="text-xs font-medium text-ink-700">
                    Delivery address
                    <textarea
                      value={shipping.address}
                      onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-marigold-500"
                      placeholder="Flat / street / city / pincode"
                    />
                  </label>

                  <div className="mt-2">
                    <p className="mb-2 text-xs font-medium text-ink-700">Payment method</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('online')}
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${paymentMethod === 'online'
                            ? 'border-berry-600 bg-berry-600 text-white'
                            : 'border-ink-200 bg-white text-ink-700'
                          }`}
                      >
                        Pay Online
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('offline')}
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${paymentMethod === 'offline'
                            ? 'border-berry-600 bg-berry-600 text-white'
                            : 'border-ink-200 bg-white text-ink-700'
                          }`}
                      >
                        Pay Offline (COD)
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-lg bg-paper-100 px-3 py-2 text-sm font-semibold text-ink-900">
                    <span>Order total</span>
                    <span>{money(cart.totalAmount)}</span>
                  </div>

                  {checkoutError && <p className="text-xs text-berry-600">{checkoutError}</p>}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="mt-1 flex items-center justify-center gap-2 rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-paper-50 transition hover:bg-berry-700 disabled:opacity-60"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Processing…
                      </>
                    ) : paymentMethod === 'offline' ? (
                      'Place Order (Pay on delivery)'
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stationary;
