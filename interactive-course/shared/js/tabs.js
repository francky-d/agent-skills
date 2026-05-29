export function attachTabs(root = document) {
  root.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = group.querySelectorAll('[role="tab"]');
    const panels = group.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
        panels.forEach((p) => p.classList.remove('active'));

        tab.setAttribute('aria-selected', 'true');
        const panelId = tab.getAttribute('aria-controls');
        const panel = group.querySelector(`#${CSS.escape(panelId)}`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}
