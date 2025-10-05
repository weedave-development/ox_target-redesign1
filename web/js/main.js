import { createOptions } from "./createOptions.js";

// DOM Elements
const optionsWrapper = document.getElementById("options-wrapper");
const body = document.body;
const targetRing = document.querySelector(".target-ring");
const targetInner = document.querySelector(".target-inner");

// State Management
let isVisible = false;
let currentOptions = [];
let isTransitioning = false;

// Event Handler
window.addEventListener("message", (event) => {
  const { event: eventType, state, options, zones } = event.data;

  switch (eventType) {
    case "visible": {
      isVisible = state;
      body.style.visibility = state ? "visible" : "hidden";
      
      if (!state) {
        resetTargetState();
        clearOptions();
      }
      break;
    }

    case "leftTarget": {
      resetTargetState();
      clearOptions();
      break;
    }

    case "setTarget": {
      if (isTransitioning) return; // Prevent rapid state changes
      
      setTargetActive();
      
      // Clear existing options immediately
      optionsWrapper.innerHTML = "";
      currentOptions = [];

      if (options) {
        console.log('Creating options:', options);
        for (const type in options) {
          options[type].forEach((data, id) => {
            createOptions(type, data, id + 1);
            currentOptions.push({ type, data, id: id + 1 });
          });
        }
      }

      if (zones) {
        console.log('Creating zones:', zones);
        for (let i = 0; i < zones.length; i++) {
          zones[i].forEach((data, id) => {
            createOptions("zones", data, id + 1, i + 1);
            currentOptions.push({ type: "zones", data, id: id + 1, zoneId: i + 1 });
          });
        }
      }
      
      console.log('Total options created:', currentOptions.length);
      console.log('Options wrapper children:', optionsWrapper.children.length);
      break;
    }
  }
});

// Helper Functions
function resetTargetState() {
  targetRing?.classList.remove("active");
  targetInner?.classList.remove("active");
}

function setTargetActive() {
  targetRing?.classList.add("active");
  targetInner?.classList.add("active");
}

function clearOptions() {
  // Clear immediately without animation to prevent issues
  optionsWrapper.innerHTML = "";
  currentOptions = [];
  isTransitioning = false;
}

// Keyboard Navigation
document.addEventListener('keydown', (event) => {
  if (!isVisible || currentOptions.length === 0 || isTransitioning) return;
  
  const options = optionsWrapper.querySelectorAll('.option-container');
  const currentFocused = optionsWrapper.querySelector('.option-container:focus');
  let currentIndex = Array.from(options).indexOf(currentFocused);
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      currentIndex = (currentIndex + 1) % options.length;
      options[currentIndex]?.focus();
      break;
    case 'ArrowUp':
      event.preventDefault();
      currentIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
      options[currentIndex]?.focus();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (currentFocused) {
        currentFocused.click();
      }
      break;
    case 'Escape':
      event.preventDefault();
      // Trigger left target event
      window.dispatchEvent(new CustomEvent('ox_target:leftTarget'));
      break;
  }
});

// Prevent context menu
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

// Prevent text selection
document.addEventListener('selectstart', (event) => {
  event.preventDefault();
});

// Performance optimization
let animationFrameId;
function optimizeAnimations() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  animationFrameId = requestAnimationFrame(() => {
    // Smooth animations here if needed
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});

// Error handling
window.addEventListener('error', (event) => {
  console.warn('OX Target UI Error:', event.error);
  // Reset state on error
  resetTargetState();
  clearOptions();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Ensure clean initial state
  resetTargetState();
  clearOptions();
});