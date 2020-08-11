The only change needed for this chapter's code was to modify the _side_module.html_ file's JavaScript to call _.Increment_ rather than _.\_Increment_.

The new code should be:

```javascript
const value = result.instance.exports.Increment(17);
```


