/** Set missing browser globals for server-side rendering. */
function setupDOMEnvironment(domain = 'https://lupos.html') {
  // Missing in Linkedom env.
  if (!globalThis.location) {
    globalThis.location = new URL(domain)
  }

  if (!globalThis.NodeFilter) {
    globalThis.NodeFilter = {
      FILTER_ACCEPT: 1,
      FILTER_REJECT: 2,
      FILTER_SKIP: 3,

      SHOW_ALL: 0xFFFFFFFF,
      SHOW_ELEMENT: 0x1,
      SHOW_ATTRIBUTE: 0x2,
      SHOW_TEXT: 0x4,
      SHOW_CDATA_SECTION: 0x8,
      SHOW_ENTITY_REFERENCE: 0x10,
      SHOW_ENTITY: 0x20,
      SHOW_PROCESSING_INSTRUCTION: 0x40,
      SHOW_COMMENT: 0x80,
      SHOW_DOCUMENT: 0x100,
      SHOW_DOCUMENT_TYPE: 0x200,
      SHOW_DOCUMENT_FRAGMENT: 0x400,
      SHOW_NOTATION: 0x800,
    }
  }

  if (!globalThis.CSS) {
    globalThis.CSS = {
      supports: () => true,
      escape: (v) => v,
      px: (v) => new globalThis.CSSUnitValue(v, 'px'),
      em: (v) => new globalThis.CSSUnitValue(v, 'em'),
      rem: (v) => new globalThis.CSSUnitValue(v, 'rem'),
    }
  }

  if (!globalThis.matchMedia) {
    globalThis.matchMedia = (query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })
  }

  if (!globalThis.history) {
    globalThis.history = {
      length: 0,
      state: null,
      pushState() {},
      replaceState() {},
      back() {},
      forward() {},
      go() {},
      scrollRestoration: 'auto',
    }
  }

  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = function(callback) {

      // Note here can't call callback immediately before returning.
      Promise.resolve().then(() => callback(0))

      return 0
    }
  }

  if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = function() {}
  }

  if (!globalThis.devicePixelRatio) {
    globalThis.devicePixelRatio = 1
  }
}

setupDOMEnvironment();
