## Hashimi Auto Solutions Website

A lightweight, production-ready business website for **Hashimi Auto Solutions** (auto parts and vehicle services in Kenya), built with plain HTML/CSS/JavaScript and a JSON-based content file for easy updates.

The site is fully static, mobile-responsive and can be hosted on any web server (shared hosting, Apache/Nginx, Netlify, Vercel, etc.).

---

### 1. Project Structure

- **`index.html`** – Landing page (hero, featured services, testimonials, CTAs).
- **`services.html`** – Service catalogue with detail modals.
- **`products.html`** – Product cards with category filter and search; “Request Quote” buttons.
- **`about.html`** – Company history, mission, values and team.
- **`contact.html`** – Contact form, map, hours, booking note.
- **`admin.html`** – In-browser content editor (no backend; downloads updated JSON).
- **`assets/css/styles.css`** – Global styles, theming, layout.
- **`assets/js/main.js`** – Shared UI behaviour (nav, dark mode, modal, helpers).
- **`assets/js/content-loader.js`** – Loads `content/site-content.json` and fills each page.
- **`assets/js/admin.js`** – Logic for the admin/content editor.
- **`content/site-content.json`** – Single source of truth for text, services, products, team, contact info.
- **`sitemap.xml` / `robots.txt`** – Basic SEO helpers (update URLs before going live).

Image files referenced in the JSON and HTML (e.g. `assets/images/hero-default.jpg`) can be replaced with real photos of your shop, team, products and services.

---

### 2. Running the Site Locally

Because content is loaded with `fetch`, you should serve the files over HTTP instead of opening `index.html` directly:

1. **Option A – VS Code / IDE simple server**
   - Use any “Live Server” / “Simple HTTP Server” extension, pointing at the project folder.

2. **Option B – Python (if installed)**

   ```bash
   cd /path/to/Website
   python -m http.server 8000
   ```

   Then open `http://localhost:8000` in your browser.

---

### 3. Deploying to a Web Server

You can deploy by uploading the folder contents to any hosting provider:

- **Shared hosting (cPanel, Namecheap, Bluehost, etc.)**
  - Upload all files and folders to `public_html` (or the web root) via File Manager or FTP.
  - Ensure folder structure is preserved, especially the `assets` and `content` folders.

- **Netlify**
  - Create a new site from your local folder or Git repository.
  - Build command: _none_ (static).
  - Publish directory: project root (where `index.html` is).

- **Vercel**
  - “Import Project” → configure as static site.
  - Output/public folder: root.

After deployment, update:

- `sitemap.xml` – Replace `https://www.example.com/` with your real domain.
- `robots.txt` – Update the `Sitemap:` URL to your domain.

---

### 4. Updating Text & Content (Beginner-Friendly)

Almost all visible text and lists live in **`content/site-content.json`**.

#### Option A – Use the Admin Page (recommended)

1. Visit `https://your-domain/admin.html` (or `http://localhost/admin.html` when local).
2. The admin loads the current `site-content.json` into several tabs:
   - **Homepage** – Hero title/subtitle, buttons, highlight bullets.
   - **Services** – JSON array of services.
   - **Products** – JSON array of products.
   - **Testimonials**, **Team**, **About**, **Contact & Hours**.
   - **Raw JSON** – Full advanced editor.
3. Make your changes (texts, descriptions, prices, etc.).
4. Click **“Download updated JSON”**.
5. On your hosting (or locally):
   - Replace the existing `content/site-content.json` with the downloaded file (same name, same path).
6. Refresh the site; your changes will appear.

> Note: The admin tool does **not** write directly to the server. It runs only in your browser, so you always download and then upload the updated JSON.

#### Option B – Edit JSON Manually

1. Open `content/site-content.json` in a text editor.
2. Carefully edit strings and array items. Common sections:
   - `homepage.hero` – main title, subtitle, button texts, highlight bullet list.
   - `services` – objects with `id`, `name`, `description`, `detailedPoints`, `image`, etc.
   - `products` – objects with `id`, `name`, `category`, `description`, `price`.
   - `testimonials`, `team`, `about`, `contactInfo`, `businessHours`.
3. Keep JSON syntax valid:
   - Double quotes around keys and values.
   - Commas between items, but **no trailing comma** after the last item.
4. Save the file and re-upload if needed.

---

### 5. Changing Colours, Fonts & Branding

Most visual branding is controlled in **`assets/css/styles.css`**:

- At the top of the file:

  ```css
  :root {
    --color-primary: #003d82;
    --color-secondary: #ff6b35;
    --color-accent: #808080;
    --color-accent-light: #c0c0c0;
    --color-bg: #ffffff;
    --color-bg-alt: #f5f5f5;
    --color-text: #1a1a1a;
    --color-text-muted: #555555;
  }
  ```

  - To adjust the main brand colours, edit `--color-primary` and `--color-secondary`.
  - Dark mode overrides live in the `[data-theme="dark"]` block.

- To change fonts:
  - Each page includes a Google Fonts link for **Roboto**.
  - Replace with your preferred font in the HTML `<head>` and update `body { font-family: ... }` in `styles.css`.

- To add your **logo**:
  - Replace `assets/images/logo-placeholder.png` with your own PNG (same filename), or:
  - Edit each HTML file and change the `<img src="assets/images/logo-placeholder.png" ...>` paths to your logo file.

---

### 6. Updating Services & Products

Both are simple JSON arrays under `services` and `products` in `content/site-content.json`.

#### Services

Each service looks like:

```json
{
  "id": "tyres",
  "name": "Tyre Sales & Installation",
  "shortTagline": "Tyres for passenger cars, SUVs and light commercial vehicles.",
  "description": "Longer description here...",
  "detailedPoints": ["Bullet 1", "Bullet 2"],
  "estimatedTime": "Typical fitment: 45–60 minutes",
  "image": "assets/images/service-tyres.jpg",
  "featured": true
}
```

- **`featured: true`** controls which services appear in the home page slider.
- `image` should point to a valid image path. You can reuse defaults or upload your own.

#### Products

Each product looks like:

```json
{
  "id": "p1",
  "name": "All-season Tyre 195/65 R15",
  "category": "Tyres",
  "description": "Product description...",
  "price": 7800,
  "image": "assets/images/product-tyre-1.jpg"
}
```

- `category` is used for filtering on `products.html`.
- `price` is in Kenyan Shillings; shown as `KES 7,800` on the site.

---

### 7. Contact Form & Email Notifications

By default, the contact form on `contact.html`:

- Displays a friendly “Thank you” message in the browser.
- Does **not** send emails (to keep the site fully static).

#### To enable real email notifications (Formspree example)

1. Create a free account at `https://formspree.io`.
2. Create a form and copy the **form endpoint URL** (e.g. `https://formspree.io/f/abcxyz`).
3. In `contact.html`, locate the `<form>` element:

   ```html
   <form
     id="contact-form"
     action="#"
     method="POST"
   >
   ```

4. Replace `action="#"` with your Formspree endpoint:

   ```html
   action="https://formspree.io/f/your-form-id"
   ```

5. Optionally remove or adjust the JavaScript that prevents default submission.

If you prefer your own backend (Node/PHP/etc.), point `action` to your API and handle form data server-side.

---

### 8. WhatsApp Integration

WhatsApp chat is configured from `contactInfo.whatsappNumber` in `content/site-content.json`:

```json
"contactInfo": {
  "whatsappNumber": "2547XXXXXXXX"
}
```

- Use the full MSISDN format without `+` (e.g. `254712345678`).
- The floating “WhatsApp” button in the bottom-right uses this number and opens a pre-filled message.

---

### 9. Dark Mode

- Dark mode is toggled via the “Dark Mode / Light Mode” button in the header.
- Implementation:
  - `body` has `data-theme="light"` or `data-theme="dark"`.
  - Styles are swapped using CSS variables in `[data-theme="dark"]`.
  - The preference is stored in `localStorage` (`hashimi-theme` key).

No extra configuration is needed; you can adjust dark colours in `styles.css` if desired.

---

### 10. SEO, Analytics & Growth Features

- **SEO basics**
  - Each page has a descriptive `<title>` and `<meta name="description">`.
  - `sitemap.xml` and `robots.txt` are included; update URLs to your domain.
  - Use meaningful headings (`<h1>`, `<h2>`) and descriptive alt text for images.

- **Google Analytics**
  - To add analytics, include the Google Tag Manager / GA4 snippet near the bottom of each HTML `<head>` or just `index.html` if preferred.

- **Newsletter / email list**
  - You can add a simple newsletter form in the footer that posts to Mailchimp, Sendy, etc. (not wired by default).

- **Google Reviews & live chat**
  - Add a “Leave a Review on Google” button linking to your Google Business review URL.
  - For live chat (e.g. Tawk.to), paste their script snippet just before `</body>` on the pages you want it to appear.

---

### 11. Extending the Site Later

Because the site is:

- Static HTML/CSS/JS,
- Driven by a central JSON file,

…it is straightforward to:

- Add new pages (copy an existing HTML file, adjust content-loader where needed).
- Migrate to a framework (Next.js/Vue) later while reusing the JSON structure.
- Plug in a lightweight backend (Node/Express or serverless functions) for:
  - Booking/appointment scheduling,
  - Full cart/checkout,
  - Blog with markdown/MDX,
  - Advanced SEO/meta control.

For most small-business use cases, the current architecture is sufficient and easy to maintain by non-developers using the `admin.html` editor plus file upload.

