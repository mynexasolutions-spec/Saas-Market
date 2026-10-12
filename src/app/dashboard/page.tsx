import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Buyer Executive Dashboard — SaaS MRKT",
  description: "Manage your saved SaaS wishlist, compare software tools, track vendor purchase quotes, and monitor corporate tech stack spending.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
