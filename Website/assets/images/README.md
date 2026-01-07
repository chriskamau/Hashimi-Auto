# Images Directory

This directory contains all images used by the Hashimi Auto Solutions website.

## Logo Files

- **hashimi-logo.svg** - Main logo with abstract icon, brand name, and tagline (SVG format, scalable)
- **favicon.svg** - Browser favicon (simplified logo icon)
- **logo-placeholder.svg** - Backup placeholder logo

## Image Files

All images are in SVG format for scalability and fast loading. They are organized by category:

### Hero Images
- `hero-default.svg` - Main homepage hero image

### Service Images
- `service-tyres.svg` - Tyre sales & installation
- `service-parts.svg` - Auto parts supply
- `service-maintenance.svg` - Vehicle maintenance & repairs
- `service-accessories.svg` - Accessories & add-ons
- `service-emergency.svg` - Emergency roadside assistance

### Product Images
- `product-tyre-1.svg` - All-season tyre 195/65 R15
- `product-tyre-2.svg` - Premium SUV tyre 225/65 R17
- `product-service-kit.svg` - Maintenance service kit
- `product-brakepads.svg` - Brake pad set
- `product-battery.svg` - Car battery
- `product-wipers.svg` - Wiper blades
- `product-mats.svg` - Floor mats
- `product-airfilter.svg` - Air filter
- `product-oilfilter.svg` - Oil filter
- `product-ledlights.svg` - LED headlight bulbs

### Testimonial Images
- `testimonial-1.svg` - Customer testimonial placeholder
- `testimonial-2.svg` - Customer testimonial placeholder
- `testimonial-3.svg` - Customer testimonial placeholder

### Team Images
- `team-1.svg` - Team member placeholder
- `team-2.svg` - Team member placeholder
- `team-3.svg` - Team member placeholder

## Replacing Placeholder Images

All current images are SVG placeholders. To replace them with real photos:

1. **Keep the same filename** - Replace the SVG file with your JPG/PNG/SVG image using the exact same name
2. **Update file extensions** - If using JPG/PNG, update references in `content/site-content.json` from `.svg` to `.jpg` or `.png`
3. **Recommended sizes**:
   - Hero images: 1200x600px minimum
   - Service/Product images: 400x300px
   - Team/Testimonial photos: 200x200px (square)
   - Logo: 200x80px (or maintain aspect ratio)

## Image Optimization

For production, consider:
- Compressing JPG/PNG images (use tools like TinyPNG, ImageOptim)
- Using WebP format for better compression (with fallbacks)
- Lazy loading images (already implemented in the website)
- Responsive images (srcset for different screen sizes)

## SVG Benefits

Current SVG images provide:
- ✅ Scalable without quality loss
- ✅ Small file sizes
- ✅ Fast loading
- ✅ Works on all devices
- ✅ Can be styled with CSS

## Adding New Images

1. Add the image file to this directory
2. Update `content/site-content.json` with the new image path
3. The website will automatically load the new image
