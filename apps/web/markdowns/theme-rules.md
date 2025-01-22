# theme-rules.md

Below are **theme-specific guidelines** for **Customerly**. We have chosen a **minimalist** theme to provide a clean, functional, and modern user experience. This document covers **color palette**, **typography**, **iconography**, and **layout accents** that align with our UI rules and tech stack.

---

## **1. Color Palette**

1. **Core Colors**  
   - **Background**: `#FFFFFF` (pure white) or a subtle off-white (e.g., `#F9FAFB`).  
   - **Text**: Primarily `#000000` or a very dark gray (e.g., `#1F2937`).  
   - **Accent**: A single, subdued accent color (like a muted blue `#3B82F6`) for primary actions (buttons, links).  
   - **Borders/Dividers**: Light gray lines (`#E5E7EB`) for subtle separation of content.

2. **State Indications**  
   - **Success**: Soft green (`#10B981`) or a light variant.  
   - **Error**: Muted red (`#EF4444`) or a light variant.  
   - **Warning**: Gentle orange (`#F59E0B`).  

3. **Hierarchy**  
   - Keep color usage minimal. Rely on small swatches of the accent color to guide the eye (e.g., button backgrounds, link hover states).

---

## **2. Typography**

1. **Font Family**  
   - Use a clean, sans-serif font (e.g., [Inter](https://fonts.google.com/specimen/Inter) or [Roboto](https://fonts.google.com/specimen/Roboto)).  
   - Keep line-height generous for readability: `1.5` or above.

2. **Font Sizes**  
   - **Body**: 14–16px, depending on user preference or system default.  
   - **Headings**: Scale them minimally (e.g., 18px for h2, 24px for h1) to maintain a simple hierarchy.  
   - **Captions / Meta**: 12–14px with lighter color (`#6B7280`) to avoid clutter.

3. **Styling**  
   - Avoid bold colors for text except for emphasis or headings.  
   - Keep strong emphasis (bold or semibold) only for critical data (ticket status or user action prompts).

---

## **3. Iconography & Imagery**

1. **Minimalist Icons**  
   - Use simple line icons or outline icons, e.g., [Heroicons](https://heroicons.com/).  
   - Keep icons around 20–24px. Only add color if indicating a key action or state change.

2. **Illustrations / Imagery**  
   - Keep them sparse. If used (e.g., in the knowledge base), they should be **light** and **flat** style.  
   - Opt for subtle placeholders over large hero images to maintain focus on content.

---

## **4. Layout & Spacing**

1. **Whitespace**  
   - Generous padding or margin around blocks of text and forms.  
   - Common spacing scale (4, 8, 16, 24, etc.) to maintain a consistent look.

2. **Grid Structure**  
   - For dashboards or multi-column layouts, keep columns well-defined but with minimal lines.  
   - Let whitespace guide the user’s eye, rather than heavy borders or backgrounds.

3. **Focus Areas**  
   - In ticket pages, highlight only the ticket content area. Keep sidebars or navs unobtrusive.  
   - For AI suggestions, use a subtle background shade (e.g., `#F3F4F6`) around the suggestion box to differentiate from the main content.

---

## **5. Animation & Interaction**

1. **Micro-interactions**  
   - On hover states for buttons, shift a slight background or text color.  
   - Use short fade-in or slide transitions to show new messages or AI suggestions.  
   - Keep it subtle to maintain the minimal aesthetic.

2. **Modal or Overlay**  
   - Use a translucent black overlay (e.g., `rgba(0,0,0,0.5)`) for modals, with a white container that has mild drop shadow.  
   - Keep transitions short (150–200ms) for a refined feel.

---

## **6. Backend Integration Notes**

1. **Supabase**  
   - If referencing status colors (Open, Pending, Closed) from the DB, ensure the UI color matches the **accent** approach.  
   - Minimize server round trips for color or style toggles—keep theme logic on the client side, referencing supabase as needed for user preferences.

2. **Next.js**  
   - For server-generated pages, ensure consistent theming by sharing a **theme config** (global CSS or context) across server and client.  
   - When building server-side rendered components, match the theme so pages do not “pop” or change style after hydration.

---

## **7. Scalability & Future Customization**

1. **Light / Dark Toggle**  
   - Our minimal theme is primarily light-based, but consider adding dark mode if user research shows demand. Keep the same minimal philosophy (e.g., white => black background, black => white text).

2. **Enterprise or White-Label**  
   - If enterprise clients want brand customization, maintain a theming system that easily swaps the accent color, typeface, or brand logo without major layout changes.

---

## **Conclusion**

By adopting this **minimalist** theme, **Customerly** will achieve a clean, professional appearance that supports swift user navigation and easy comprehension. Our color palette, typographic choices, spacing, and subtle interactions all reinforce clarity—ensuring that **ticket creation**, **agent workflows**, and **admin tasks** remain efficient and visually cohesive.