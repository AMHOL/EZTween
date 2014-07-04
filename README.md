EZTween
=======

Simple Javascript tweening library to tween values (can only tween numeric/objects containing numerics)


##### Why

Because I want to animate Google maps markers and need to tween between latLng's but couldn't find a tweening library that wasn't coupled with DOM CSS attributes.

##### Usage
```javascript
(new EZ.Tween({ x: 100, y: 150 })).setTo({ x: 150, y: 250 }).setDuration(3000).start(function(current) { console.log(current); });
```