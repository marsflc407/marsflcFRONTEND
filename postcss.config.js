import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const removeObsoleteVendorProperties = {
  postcssPlugin: "remove-obsolete-vendor-properties",
  OnceExit(root) {
    root.walkDecls((decl) => {
      if (
        decl.prop === "-webkit-text-size-adjust" ||
        decl.prop === "-moz-column-gap"
      ) {
        decl.remove();
      }
    });
  },
};

export default {
  plugins: [tailwindcss(), autoprefixer(), removeObsoleteVendorProperties],
};
