# Reproducing an issue with treeshaking

1. yarn install
2. yarn build
3. yarn analyze-bundle

Observe that the whole mdi.js is imported (at 2.6MB) even though only a few icons are used


- package.json has
```
   "sideEffects": [
    "*.scss",
    "*.css"
  ],
```
- Babel is configured with `"modules": false`
- webpack config has:
  - usedExports: true,
  - terser 3 passes