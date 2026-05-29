// Set element content as inline-HTML when it contains tags, plain text otherwise.
// Authors write `<code>`, `<em>`, `<strong>`, `<a>` etc. inside narrative fields;
// `textContent` would render those as literal characters.
export function setInline(el, value) {
  if (value == null) return;
  const s = String(value);
  if (s.includes('<')) el.innerHTML = s;
  else el.textContent = s;
}
