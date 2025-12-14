/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,jsx,ts,tsx,mdx}",
		"./components/**/*.{js,jsx,ts,tsx,mdx}",
		"./pages/**/*.{js,jsx,ts,tsx,mdx}",
		"./contexts/**/*.{js,jsx,ts,tsx}",
		"./lib/**/*.{js,jsx,ts,tsx}",
	],
	safelist: [
		// Ensure common utility classes are always included
		'pt-28', 'pt-32', 'pt-40', 'pb-12', 'min-h-screen', 'mt-8', 'mb-8', 'text-center',
		'mt-[20vh]', 'mb-4', 'text-4xl', 'font-bold', 'md:text-5xl',
		'text-transparent', 'bg-clip-text', 'bg-gradient-to-r',
		'from-indigo-600', 'to-purple-600', 'container', 'px-4', 'px-6',
		'sm:px-6', 'lg:px-8', 'flex', 'items-center', 'justify-center',
		'hidden', 'md:flex', 'md:block', 'gap-2', 'gap-4', 'gap-6',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [],
};

export default config;
