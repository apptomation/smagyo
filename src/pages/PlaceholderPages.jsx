import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";

const C = {
  charcoal: "#1C1C1C",
  emerald: "#2D6A4F",
  sage: "#52796F",
  cream: "#FAF7F2",
};

function PlaceholderPage({ title, emoji, description, ctaLabel, ctaHref }) {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center"
      style={{ background: C.cream }}
    >
      <div className="text-6xl mb-6">{emoji}</div>
      <h1
        className="text-3xl font-bold mb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.charcoal }}
      >
        {title}
      </h1>
      <p
        className="text-base mb-8 max-w-sm"
        style={{ color: C.sage, fontFamily: "'DM Sans', sans-serif" }}
      >
        {description}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-semibold"
          style={{ background: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
        >
          {ctaLabel} <ArrowRight size={15} />
        </Link>
      )}
      <div
        className="mt-6 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
        style={{ background: "rgba(45,106,79,.08)", color: C.emerald, fontFamily: "'DM Sans', sans-serif" }}
      >
        <Leaf size={10} /> Coming soon — this page is under construction
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <PlaceholderPage
      title="Create Your Account"
      emoji="🌸"
      description="Join the Smagyo community to track orders, save wishlists, and unlock exclusive member deals."
      ctaLabel="Back to Home"
      ctaHref="/"
    />
  );
}

export function LoginPage() {
  return (
    <PlaceholderPage
      title="Welcome Back"
      emoji="🌿"
      description="Sign in to your Smagyo account to access your orders, wishlist, and saved preferences."
      ctaLabel="Back to Home"
      ctaHref="/"
    />
  );
}

export function OccasionsPage() {
  return (
    <PlaceholderPage
      title="Shop by Occasion"
      emoji="💒"
      description="Browse flowers and bouquets curated for birthdays, weddings, anniversaries, and every special moment."
      ctaLabel="View All Bouquets"
      ctaHref="/bouquets"
    />
  );
}

export function BouquetsPage() {
  return (
    <PlaceholderPage
      title="Flower Bouquets"
      emoji="💐"
      description="Explore our full collection of handcrafted flower bouquets — roses, lilies, sunflowers, and more."
      ctaLabel="Back to Home"
      ctaHref="/"
    />
  );
}

export function PlantsPage() {
  return (
    <PlaceholderPage
      title="Plants Collection"
      emoji="🪴"
      description="Discover beautiful indoor plants, succulents, orchids, and bonsai for your home or as a gift."
      ctaLabel="Back to Home"
      ctaHref="/"
    />
  );
}

export function WishlistPage() {
  return (
    <PlaceholderPage
      title="Your Wishlist"
      emoji="❤️"
      description="Save your favourite arrangements here and share them with friends and family."
      ctaLabel="Browse Bouquets"
      ctaHref="/bouquets"
    />
  );
}

export function AboutPage() {
  return (
    <PlaceholderPage
      title="Our Story"
      emoji="🌱"
      description="Smagyo was born from a love of flowers and a belief that nature's beauty should be available to everyone, sustainably."
      ctaLabel="Shop Now"
      ctaHref="/bouquets"
    />
  );
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Page Not Found"
      emoji="🌵"
      description="The page you're looking for doesn't exist yet. Let's get you back on track."
      ctaLabel="Return Home"
      ctaHref="/"
    />
  );
}
