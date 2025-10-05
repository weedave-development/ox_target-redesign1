import { fetchNui } from "./fetchNui.js";

const optionsWrapper = document.getElementById("options-wrapper");

// Click handler with improved feedback
function onClick(event) {
  // Prevent multiple rapid clicks
  if (this.style.pointerEvents === "none") return;
  
  // Disable pointer events temporarily
  this.style.pointerEvents = "none";
  
  // Visual feedback
  this.style.transform = "translateX(2px) scale(0.98)";
  this.style.background = "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 245, 160, 0.1) 100%)";
  
  // Reset after animation
  setTimeout(() => {
    this.style.transform = "";
    this.style.background = "";
    this.style.pointerEvents = "auto";
  }, 150);

  // Send NUI callback
  fetchNui("select", [this.targetType, this.targetId, this.zoneId]);
}

// Hover effects
function onMouseEnter() {
  this.style.transform = "translateX(4px)";
}

function onMouseLeave() {
  this.style.transform = "";
}

// Focus effects
function onFocus() {
  this.style.outline = "2px solid var(--emerald-400)";
  this.style.outlineOffset = "2px";
}

function onBlur() {
  this.style.outline = "";
  this.style.outlineOffset = "";
}

// Keyboard support
function onKeyDown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onClick.call(this, event);
  }
}

// Create option element
export function createOptions(type, data, id, zoneId) {
  console.log('createOptions called:', { type, data, id, zoneId });
  
  if (data.hide) {
    console.log('Option hidden:', data);
    return;
  }

  const option = document.createElement("div");
  
  // Create icon element
  const iconElement = document.createElement("i");
  iconElement.className = `fa-fw ${data.icon} option-icon`;
  if (data.iconColor) {
    iconElement.style.color = data.iconColor;
  }
  
  // Create label element
  const labelElement = document.createElement("span");
  labelElement.className = "option-label";
  labelElement.textContent = data.label;
  
  // Set up option element
  option.className = "option-container";
  option.targetType = type;
  option.targetId = id;
  option.zoneId = zoneId;
  option.tabIndex = 0;
  
  // Accessibility attributes
  option.setAttribute("role", "button");
  option.setAttribute("aria-label", data.label);
  if (data.description) {
    option.setAttribute("title", data.description);
  }
  
  // Append elements
  option.appendChild(iconElement);
  option.appendChild(labelElement);
  
  // Event listeners
  option.addEventListener("click", onClick);
  option.addEventListener("mouseenter", onMouseEnter);
  option.addEventListener("mouseleave", onMouseLeave);
  option.addEventListener("focus", onFocus);
  option.addEventListener("blur", onBlur);
  option.addEventListener("keydown", onKeyDown);
  
  // Prevent context menu
  option.addEventListener("contextmenu", (e) => e.preventDefault());
  
  // Append to wrapper
  optionsWrapper.appendChild(option);
  console.log('Option appended to DOM. Total children:', optionsWrapper.children.length);
  
  // Don't auto-focus first option
}