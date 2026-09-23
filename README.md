# Nasihah Legal — website

Static site. No build step, no dependencies: plain HTML, one stylesheet, one script.
Upload the whole folder to any host (Netlify, Vercel, Cloudflare Pages, cPanel) and it works.

## Files

```
index.html              Home
about.html              About the firm — our name, how we work, people, languages, fees
practice-areas.html     Overview of the five areas
civil-litigation.html   ┐
criminal-law.html       │
family-law.html         ├ one page per practice area
wills-estates.html      │
property-law.html       ┘
faqs.html               FAQs by category
careers.html            Careers
privacy-terms.html      Privacy policy, terms of use, disclaimer
contact.html            Enquiry form, contact details, Google map
assets/css/site.css     All styling (brand colours are CSS variables at the top)
assets/js/site.js       Navigation + enquiry form
assets/img/             Photography
favicon.svg             NL monogram
sitemap.xml, robots.txt For search engines
```

## Connect the enquiry form (Web3Forms)

1. Get a free access key at <https://web3forms.com> (it's emailed to you).
2. Open `contact.html`, find this line and paste the key in:

```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```

That's the only change needed. Enquiries then arrive at the email address tied to the key.
Until a key is added, the form tells visitors to call or email instead.

## Before going live

1. **Paste the Web3Forms key** (above). This is the only thing that stops the site working.
2. **Check the details I set for you:**
   - Office hours on `contact.html` — Monday to Friday 9:00am–5:00pm, evenings and weekends by appointment.
   - The privacy policy on `privacy-terms.html` — it says files are kept at least seven years, that some
     providers may store data offshore, and that the site uses no analytics or advertising cookies.
     All true as the site stands; confirm it matches your practice.
   - Whether you need to add your ABN and a "Liability limited by a scheme approved under Professional
     Standards Legislation" line to the footer and privacy page.
3. **Point the domain.** `sitemap.xml` and `robots.txt` assume `https://nasihahlegal.com.au/`.
4. **Review count.** `5.0 · 36 Google reviews` is baked into several pages — search `36 Google reviews`
   to update it as reviews come in.

## Adding a client review

Reviews live in the carousel on `index.html` and `about.html`. To add one, copy an existing block
inside `.reviews__track` and edit it — in **both** files, so the two carousels stay in step:

```html
<figure class="quote">
  <span class="quote__mark" aria-hidden="true">&ldquo;</span>
  <blockquote>The trimmed review text.</blockquote>
  <figcaption>Reviewer Name · Google review</figcaption>
</figure>
```

Then update the `1 / 14` counter text in `[data-carousel-count]` on that page, and the
`36 Google reviews` label if the total has moved. Only quote reviews that are genuinely public
on the Google listing.

## Editing

- **Brand colours and fonts** live at the top of `assets/css/site.css` as CSS variables.
- **Header and footer** are repeated in each HTML file. If you change a nav link, change it in all pages
  (search and replace works fine).
- **Photography**: `mohammed-moustafa.jpg` is the real photo (used on the home page and About).
  `social-card.jpg` is the logo tile used for link previews. The remaining images in `assets/img/`
  are AI-generated stand-ins — swap in real photos of the office and Sydney Road when you have them,
  keeping the same file names, and nothing else needs editing.
- **Iman Mustafa** has no photo yet. Her profile uses the NL monogram tile; to add a portrait, replace
  the `<span class="profile__mark">` block in `about.html` with an `<img class="profile__photo">`.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.
