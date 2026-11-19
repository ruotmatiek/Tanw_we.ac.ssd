# Testire – Global Online Shopping (Front-end)

Testire is a responsive, Jumia-inspired e-commerce front-end. Shoppers pick their country and every price (stored in US$) converts instantly to their local currency.

## Files
| File | Purpose |
|---|---|
| `index.html` | Page structure: header, search, categories menu, product grid, cart drawer, checkout dialog |
| `style.css` | Responsive styling (phones, tablets, laptops, large screens), dark mode, safe-area support |
| `script.js` | Products, country/currency conversion, search, sort, cart, checkout logic |
| `README.md` | This guide |

## Features
- 60+ products across 16 categories (phones, computers, fashion, shoes, appliances, groceries, gaming and more)
- **Categories button** (☰) opens the full product list menu; category chips and search also filter
- Country selector with 32 countries; auto-detects from browser language
- US$ → local currency conversion: live rates from `open.er-api.com` when online, built-in fallback rates offline
- Flash-sale discounts, star ratings, sorting (popular, price, rating)
- Cart drawer with quantity controls, free delivery over US$ 50, checkout form
- Cart and country remembered with `localStorage`
- Keyboard accessible, reduced-motion and dark-mode friendly

## Run it
No build step. Put the four files in one folder and open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Customize
- **Add products:** add a row `["Name","Category",priceUSD,"🙂"]` to `RAW` in `script.js`.
- **Add categories:** add a name to `CATS` and use it in products.
- **Add countries:** add `["XX","Country","CUR",rate]` to `COUNTRIES`.
- **Real images:** replace the emoji in the `.pic` block inside `renderGrid()` with an `<img>` tag.
- **Brand colors:** edit the variables at the top of `style.css`.

## Notes
This is a front-end demo. Checkout does not process payments; connect it to a backend and payment provider (M-Pesa, Flutterwave, Stripe) for production.
