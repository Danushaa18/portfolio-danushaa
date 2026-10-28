// Module loader + shims shared by the preview pages.
// Expects globals: React, ReactDOM (or the mini shim), gsap, ScrollTrigger, Motion (framer-motion UMD or stub).
(function () {
  var defs = {};
  var cache = {};

  window.process = { env: { NODE_ENV: "development" } };

  function useGSAP(fn, config) {
    var scope = config && config.scope;
    React.useLayoutEffect(function () {
      var ctx = gsap.context(function () {
        var cleanup = fn();
        return cleanup;
      }, scope && scope.current ? scope.current : undefined);
      return function () {
        ctx.revert();
      };
    }, []);
  }

  function NextImage(props) {
    var style = Object.assign({ position: "absolute", inset: 0, width: "100%", height: "100%" }, props.style || {});
    return React.createElement("img", {
      src: props.src,
      alt: props.alt,
      className: props.className,
      style: style,
      loading: props.priority ? "eager" : "lazy",
      decoding: "async",
    });
  }

  var externals = {
    react: function () { return React; },
    "react-dom": function () { return window.ReactDOM; },
    gsap: function () { return { gsap: gsap, default: gsap }; },
    "gsap/ScrollTrigger": function () { return { ScrollTrigger: ScrollTrigger }; },
    "@gsap/react": function () { return { useGSAP: useGSAP }; },
    "framer-motion": function () { return window.Motion; },
    "next/image": function () { return { default: NextImage, __esModule: true }; },
  };

  window.__define = function (id, factory) {
    defs[id] = factory;
  };

  function resolve(from, req) {
    if (req.indexOf("./") === 0) {
      var base = from.split("/").slice(0, -1).join("/");
      return base + "/" + req.slice(2);
    }
    return req;
  }

  window.__require = function require(id) {
    if (externals[id]) return externals[id]();
    if (cache[id]) return cache[id].exports;
    var factory = defs[id];
    if (!factory) throw new Error("Preview: module not found " + id);
    var module = { exports: {} };
    cache[id] = module;
    factory(function (req) { return require(resolve(id, req)); }, module.exports, module);
    return module.exports;
  };
})();
