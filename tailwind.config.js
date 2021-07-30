module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: "rgba(255,255,255,0)",
      white: {
        100: "#FFF",
        200: "#F0F0F0",
        300: "#EEEE",
        400: "#CCC",
      },
      primary: {
        100: "#CE1212",
        200: "#b91010",
      },
      black: {
        100: "#333",
        200: "#555",
      },
      red: {
        100: "#FF7171",
      },
      green: {
        100: "#70AF85",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
