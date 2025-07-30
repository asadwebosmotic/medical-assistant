import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Medical Theme Colors
				medical: {
					primary: 'hsl(var(--medical-primary))',
					'primary-foreground': 'hsl(var(--medical-primary-foreground))',
					accent: 'hsl(var(--medical-accent))',
					success: 'hsl(var(--medical-success))',
					warning: 'hsl(var(--medical-warning))',
					danger: 'hsl(var(--medical-danger))'
				},
				
				// Status Colors for Medical Values
				status: {
					normal: 'hsl(var(--status-normal))',
					elevated: 'hsl(var(--status-elevated))',
					high: 'hsl(var(--status-high))',
					low: 'hsl(var(--status-low))'
				},
				
				// Text Colors
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					muted: 'hsl(var(--text-muted))'
				},
				
				// Button Colors
				button: {
					primary: 'hsl(var(--button-primary))',
					'primary-hover': 'hsl(var(--button-primary-hover))',
					secondary: 'hsl(var(--button-secondary))',
					'secondary-hover': 'hsl(var(--button-secondary-hover))'
				},
				
				primary: {
					DEFAULT: 'hsl(var(--medical-primary))',
					foreground: 'hsl(var(--medical-primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--button-secondary))',
					foreground: 'hsl(var(--text-primary))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--medical-danger))',
					foreground: 'hsl(var(--text-primary))'
				},
				muted: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--text-muted))'
				},
				accent: {
					DEFAULT: 'hsl(var(--medical-accent))',
					foreground: 'hsl(var(--text-primary))'
				},
				popover: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--text-primary))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--text-primary))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
