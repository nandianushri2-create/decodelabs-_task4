# Create Your Account — Form Design & Validation

**DecodeLabs Frontend Development — Project 4 (Optional Mastery Phase)**

A signup form that validates itself: semantic HTML, JavaScript-driven validation with regex, and accessible error messaging wired together with ARIA.

## What this demonstrates

| Phase | What it covers | Where it lives |
|---|---|---|
| 1. Structure | Semantic `<form>`, `<label>`, `<input>` — no `<div>` soup | `index.html` |
| 2. Shield | `event.preventDefault()` stops the browser's default refresh | `script.js` |
| 3. Scan | Regex logic gates for password strength and email syntax | `script.js` |
| 4. Communicate | Inline error/success text, `aria-invalid`, `aria-describedby`, `aria-live` | `index.html` + `script.js` |

## Files

```
signup-form-split/
├── index.html    Markup and structure
├── styles.css    Visual styling
└── script.js     Validation logic and form behavior
```

## Running it

No build step or server needed. Download all three files into the same folder and open `index.html` in a browser.

## Validation rules

- **Full name** — required, minimum 2 characters
- **Email** — required, must match a general email pattern (`text@text.text`)
- **Password** — required, minimum 8 characters, must include:
  - one uppercase letter
  - one lowercase letter
  - one digit
  - one special character (`#?!@$%^&*-`)
- **Confirm password** — must match the password field
- **Terms checkbox** — must be checked before submitting

Fields validate on **blur** (when you leave the field), not on every keystroke, so screen reader users aren't interrupted mid-type. The password field also shows a live strength meter as you type.

## Accessibility features

- Every input is tied to its own error message via `aria-describedby`
- Invalid fields get `aria-invalid="true"`; the error text has `role="alert"`
- The overall form status banner uses `aria-live="polite"`, so success/failure is announced without yanking focus
- On a failed submit, keyboard focus automatically moves to the first invalid field

## On submit

- `event.preventDefault()` stops the page from reloading
- All fields are re-validated regardless of blur history
- If everything passes, the form logs a JSON payload to the console (passwords are never logged) and shows a success message
- If anything fails, the form shows which fields need attention and focuses the first one

## Customizing

- **Change password rules** — edit the `PATTERNS.password` regex in `script.js`
- **Add a field** — add the markup in `index.html`, an entry in the `validators` object in `script.js`, and matching styles in `styles.css`
- **Connect to a real backend** — replace the `console.log(payload)` line in `script.js` with a `fetch()` call to your API

## Browser support

Works in all modern evergreen browsers (Chrome, Firefox, Safari, Edge). No external dependencies or frameworks.