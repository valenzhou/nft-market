import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    "purple-dark": {
      extend: "dark",
      colors: {
        primaryLight: '$blue200',
        primaryLightHover: '$blue300',
        primaryLightActive: '$blue400',
        primaryLightContrast: '$blue600',
        primary: '$purple500',
        primaryBorder: '$blue500',
        primaryBorderHover: '$blue600',
        primarySolidHover: '$blue700',
        primarySolidContrast: '$white',
        primaryShadow: '$white500',
        transparent: '#00000000',
        gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple300 90%)',
        link: '#5E1DAD',
        myColor: '#00000030'
      },
    }
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
