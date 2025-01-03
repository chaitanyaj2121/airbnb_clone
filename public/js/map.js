
mapboxgl.accessToken = mapTokan;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90 
    zoom: 10 // starting zoom
});

// coordinates  and map token are coming from show.ejs
//  console.log(coordinates);  // this res is shown in side browser console
 
const marker1 = new mapboxgl.Marker({color:"red "})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML("<h3>Hii</h3><p>Exact Location provided after booking </p>"))
        .addTo(map);
    

