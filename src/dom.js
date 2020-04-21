/**
 * (Internal) Removes an element from the DOM.
 *
 * @param {HTMLElement | null | void} element
 */

export function removeElement(element) {
  element && element.parentNode && element.parentNode.removeChild(element);
}

/**
 * (Internal) Gets a space separated list of the class names on the element.
 * The list is wrapped with a single space on each end to facilitate finding
 * matches within the list.
 *
 * @param {HTMLElement | null | void} element
 */

export function classList(element) {
  return (" " + ((element && element.className) || "") + " ").replace(
    /\s+/gi,
    " "
  );
}

/**
 * (Internal) Determines if an element or space separated list of class names
 * contains a class name.
 *
 * @param {HTMLElement} element
 * @param {string} name
 */

export function hasClass(element, name) {
  var list = typeof element == "string" ? element : classList(element);
  return list.indexOf(" " + name + " ") >= 0;
}

/**
 * (Internal) Adds a class to an element.
 * @param {HTMLElement} element
 * @param {string} name
 */

export function addClass(element, name) {
  var oldList = classList(element),
    newList = oldList + name;

  if (hasClass(oldList, name)) return;

  // Trim the opening space.
  element.className = newList.substring(1);
}

/**
 * (Internal) Removes a class from an element.
 */

export function removeClass(element, name) {
  var oldList = classList(element),
    newList;

  if (!hasClass(element, name)) return;

  // Replace the class name.
  newList = oldList.replace(" " + name + " ", " ");

  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1);
}
