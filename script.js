(function () {
  "use strict";

  const form = document.getElementById("signupForm");
  const formStatus = document.getElementById("formStatus");
  const passwordMeter = document.getElementById("passwordMeter");

  // ---- Regex "Logic Gates" -------------------------------------------
  const PATTERNS = {
    // Requires: 1 uppercase, 1 lowercase, 1 digit, 1 special char, 8+ length
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    // General-purpose syntax check (Syntax Validation, not Verification)
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  };

  const validators = {
    fullName(value) {
      if (value.trim() === "") return "Enter your full name.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return null;
    },
    email(value) {
      if (value.trim() === "") return "Enter your email address.";
      if (!PATTERNS.email.test(value.trim())) return "That doesn't look like a valid email address.";
      return null;
    },
    password(value) {
      if (value === "") return "Create a password.";
      if (!PATTERNS.password.test(value)) {
        return "Password needs 8+ characters, an uppercase letter, a lowercase letter, a number, and a symbol (#?!@$%^&*-).";
      }
      return null;
    },
    confirmPassword(value) {
      const password = document.getElementById("password").value;
      if (value === "") return "Re-enter your password.";
      if (value !== password) return "Passwords don't match.";
      return null;
    },
    terms(checked) {
      if (!checked) return "You must accept the terms to continue.";
      return null;
    }
  };

  function passwordStrength(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[#?!@$%^&*-]/.test(value)) score++;
    return score;
  }

  function setFieldState(fieldName, errorMessage) {
    const input = document.getElementById(fieldName);
    const errorEl = document.getElementById(fieldName + "-error");
    const icon = document.getElementById(fieldName + "-icon");

    if (errorMessage) {
      input.setAttribute("aria-invalid", "true");
      input.classList.remove("is-valid");
      errorEl.textContent = errorMessage;
      errorEl.classList.add("show");
      if (icon) {
        icon.textContent = "✕";
        icon.classList.add("show", "bad");
        icon.classList.remove("good");
      }
      return false;
    } else {
      input.setAttribute("aria-invalid", "false");
      input.classList.add("is-valid");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
      if (icon) {
        icon.textContent = "✓";
        icon.classList.add("show", "good");
        icon.classList.remove("bad");
      }
      return true;
    }
  }

  function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const value = fieldName === "terms" ? input.checked : input.value;
    const error = validators[fieldName](value);
    return setFieldState(fieldName, error);
  }

  // Live validation on blur (not on every keystroke — avoids alert spam
  // for screen reader users)
  ["fullName", "email", "password", "confirmPassword"].forEach((fieldName) => {
    const input = document.getElementById(fieldName);
    input.addEventListener("blur", () => validateField(fieldName));
  });

  document.getElementById("terms").addEventListener("change", () => validateField("terms"));

  // Password strength meter updates live as the user types (visual only)
  document.getElementById("password").addEventListener("input", (e) => {
    const strength = passwordStrength(e.target.value);
    passwordMeter.setAttribute("data-strength", String(strength));
  });

  // Re-check confirm-password whenever password changes after first blur
  document.getElementById("password").addEventListener("input", () => {
    const confirmInput = document.getElementById("confirmPassword");
    if (confirmInput.getAttribute("aria-invalid") !== null && confirmInput.value !== "") {
      validateField("confirmPassword");
    }
  });

  // ---- Stop the default refresh, then run every gate ------------------
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents the hard page reset / state wipe

    const fieldNames = ["fullName", "email", "password", "confirmPassword", "terms"];
    const results = fieldNames.map(validateField);
    const allValid = results.every(Boolean);

    formStatus.classList.remove("good", "bad", "show");

    if (!allValid) {
      formStatus.textContent = "Some fields need your attention before we can continue.";
      formStatus.classList.add("bad", "show");

      // Move focus to the first invalid field for keyboard/screen-reader users
      const firstInvalid = fieldNames.find((name, i) => !results[i]);
      document.getElementById(firstInvalid).focus();
      return;
    }

    // Package the approved payload
    const payload = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: "••••••••" // never log real passwords
    };

    console.log("Approved payload ->", JSON.stringify(payload));

    formStatus.textContent = "Account created. Welcome aboard!";
    formStatus.classList.add("good", "show");
    form.reset();
    passwordMeter.setAttribute("data-strength", "0");

    // Clear visual valid/invalid states after a successful reset
    fieldNames.forEach((name) => {
      const input = document.getElementById(name);
      input.removeAttribute("aria-invalid");
      input.classList.remove("is-valid");
      const err = document.getElementById(name + "-error");
      if (err) err.classList.remove("show");
      const icon = document.getElementById(name + "-icon");
      if (icon) icon.classList.remove("show");
    });
  });
})();