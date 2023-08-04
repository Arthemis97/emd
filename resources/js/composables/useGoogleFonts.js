import { useHead } from "@vueuse/head";

export function useGoogleFonts() {
    useHead({
        link: [
            {
                rel: "preconnect",
                href: "https://fonts.googleapis.com",
            },
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: "crossorigin",
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap",
            },
        ],
    });
}
