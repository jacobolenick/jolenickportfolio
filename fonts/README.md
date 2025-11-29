# Fonts Directory

## Apple Garamond Font Files

Place your Apple Garamond font files in this directory with the following names:

### Required files:
- `AppleGaramond.woff2` (best browser support)
- `AppleGaramond.woff` (fallback)
- `AppleGaramond.ttf` (fallback)

### Optional (for bold weights):
- `AppleGaramond-Bold.woff2`
- `AppleGaramond-Bold.woff`
- `AppleGaramond-Bold.ttf`

## Where to get Apple Garamond

Apple Garamond is a proprietary font. You can:

1. **If you have the font files**: Simply copy them to this directory
2. **Purchase from a font foundry**: Check Linotype or similar font vendors
3. **Use an alternative**: If you don't have access, consider these similar serif fonts:
   - Garamond Premier Pro
   - EB Garamond (free Google Font)
   - Cormorant Garamond (free Google Font)

## Using Google Fonts Alternative

If you want to use a free alternative, you can replace the font-face declarations in `styles.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&display=swap');
```

Then change the CSS variable:
```css
--heading-font: 'EB Garamond', Georgia, serif;
```




