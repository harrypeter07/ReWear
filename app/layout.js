import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { UserProvider } from "../contexts/UserContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "ReWear – Community Clothing Exchange",
	description:
		"A platform for sustainable fashion: swap, redeem, and share clothing in your community.",
	keywords: [
		"clothing exchange",
		"sustainable fashion",
		"swap",
		"community",
		"ReWear",
		"reuse",
		"Next.js",
	],
	authors: [
		{ name: "Hassan Mansuri", email: "hassanmansuri570@gmail.com" },
		{ name: "Shraddha Bhisikar", email: "shra.bhisikar@gmail.com" },
		{ name: "Ritika Jain", email: "jainr_1@rknec.edu" },
		{ name: "Harshal Pande", email: "pandeh@rknec.edu" },
	],
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<UserProvider>
					<Navbar />
					<main>{children}</main>
				</UserProvider>
			</body>
		</html>
	);
}
