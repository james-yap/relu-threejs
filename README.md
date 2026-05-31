 ReLU, explained

Enable HTML in Canvas API:

```plaintext
chrome://flags/#canvas-draw-element
```

Debug mode bookmarklet:

```js
javascript:(()=>{const u=new URL(location.href);u.searchParams.get('mode')==='debug'?u.searchParams.delete('mode'):u.searchParams.set('mode','debug');location.href=u.toString();})();
```
