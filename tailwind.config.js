export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                geminiBlue: "#6366f1",
                geminiPurple: "#8b5cf6",
                geminiDark: "#1e1b4b",
            },
        },
    },
    plugins: [],
};
