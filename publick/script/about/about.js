var ML;
$(document).ready(function(){
  $.post('/getMapPoint', function(res){
    data = res.data;

    var iconclasses = {
      exclamation: 'font-size: 22px;',
      A: 'font-size: 22px;'
    };
    var map = new L.Map('map', {
      center: [data[0].lat,data[0].lon],
      zoom: 13,
      zoomControl:false,
      leafletControl: false
    });
    L.tileLayer('http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0').addTo(map);
    // L.tileLayer('https://stamen-tiles-c.a.ssl.fastly.net/toner/{z}/{x}/{y}.png').addTo(map);

    data.forEach(function(row){
      var pos = new L.LatLng(row.lat,row.lon);
      var iconclass = iconclasses[row.iconclass]?row.iconclass:'';
      var iconstyle = iconclass?iconclasses[iconclass]:'';
      var icontext = iconclass?'':row.iconclass;

       var icon = L.divIcon({
         className: 'map-marker '+iconclass,
         iconSize:null,
         html:'<div class="icon" style="'+iconstyle+'">'+icontext+'</div><div class="arrow" />',
         iconUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6362/marker.png'
       });

      L.marker(pos).addTo(map).setIcon(L.icon({
        iconUrl: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cGF0aCBzdHlsZT0iZmlsbDojNzI1RDU3OyIgZD0iTTMwLDExMS44OTlWNDUyaDQ1MlYxMTEuODk5SDMweiIvPgo8cmVjdCB4PSIyNTYiIHk9IjExMS45IiBzdHlsZT0iZmlsbDojNjg1NDRGOyIgd2lkdGg9IjIyNiIgaGVpZ2h0PSIzNDAuMSIvPgo8cGF0aCBzdHlsZT0iZmlsbDojNTM0MzNGOyIgZD0iTTI0MSwzOTJIOTBWMjQwaDE1MVYzOTJ6Ii8+CjxyZWN0IHg9IjEyMCIgeT0iMjcwIiBzdHlsZT0iZmlsbDojRURFOUU4OyIgd2lkdGg9IjkxIiBoZWlnaHQ9IjkyIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiM1MzQzM0Y7IiBkPSJNNDY3LDQyMkg0NWMtMjQuOTAxLDAtNDUsMjAuMDk5LTQ1LDQ1djQ1aDUxMnYtNDVDNTEyLDQ0Mi4wOTksNDkxLjkwMSw0MjIsNDY3LDQyMnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzNFMzIyRTsiIGQ9Ik01MTIsNDY3djQ1SDI1NnYtOTBoMjExQzQ5MS45MDEsNDIyLDUxMiw0NDIuMDk5LDUxMiw0Njd6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNEMkM1QzI7IiBkPSJNMzg0LjUsMTIwdjI2LjRjMCwzNS4wOTktMjkuNSw2My42LTY0LjksNjMuNmMtMzUuMDk5LDAtNjMuNi0yOC41LTYzLjYtNjMuNiAgYzAsMzUuMDk5LTI4LjUsNjMuNi02My42LDYzLjZjLTM1LjQsMC02NC45LTI4LjUtNjQuOS02My42VjEyMEgzODQuNXoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0I3NjBFQTsiIGQ9Ik0xNjMuNzQ5LDEzMS4yNUwxMjcuNSwxMjBINzUuMTc4TDAuMzYzLDE0OS44NTVDMi4yNjksMTgzLjM1MywyOS43NzcsMjEwLDYzLjc1LDIxMCAgYzMzLjk3NSwwLDYxLjQ4NS0yNi42NTMsNjMuMzg3LTYwLjE1MkwxMjcuNSwxNTBMMTYzLjc0OSwxMzEuMjV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNBMjRCREI7IiBkPSJNNDcxLjcxNSwxMjBIMzg0LjV2My4yODFsLTI4LjEyNSwxMS4wOTNMMzg0LjUsMTQ2LjI1YzAsMzUuMjA4LDI4LjU0Miw2My43NSw2My43NSw2My43NSAgYzM0LjAxMiwwLDYxLjU1MS0yNi43MTEsNjMuMzk4LTYwLjI2Mkw0NzEuNzE1LDEyMHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0M0QjNBRjsiIGQ9Ik0zODQuNSwxMjB2MjYuNGMwLDM1LjA5OS0yOS41LDYzLjYtNjQuOSw2My42Yy0zNS4wOTksMC02My42LTI4LjUtNjMuNi02My42VjEyMEgzODQuNXoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzUzNDMzRjsiIGQ9Ik00MTYuMywwSDk1LjdsLTQ1LDkwaDQxMC42TDQxNi4zLDB6Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiMzRTMyMkU7IiBwb2ludHM9IjQ2MS4zLDkwIDI1Niw5MCAyNTYsMCA0MTYuMywwICIvPgo8cGF0aCBzdHlsZT0iZmlsbDojREE5MEY4OyIgZD0iTTQzNyw2MEg3NUMzMy42LDYwLDAsOTMuNiwwLDEzNXYxNWg1MTJ2LTE1QzUxMiw5My42LDQ3OC40LDYwLDQzNyw2MHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0NCNzVGNjsiIGQ9Ik01MTIsMTM1djE1SDI1NlY2MGgxODFDNDc4LjQsNjAsNTEyLDkzLjYsNTEyLDEzNXoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0VERTlFODsiIGQ9Ik0zODQuNSwxMjMuM1YxNTBoLTI1N3YtMjYuN2MwLTM1LjA5OSwyOC4yLTYzLjMsNjMuMy02My4zaDEzMC40QzM1Ni4zLDYwLDM4NC41LDg4LjIsMzg0LjUsMTIzLjN6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNERkQ3RDU7IiBkPSJNMzg0LjUsMTUwSDI1NlY2MGg2NS4yYzM1LjA5OSwwLDYzLjMsMjguMiw2My4zLDYzLjNWMTUweiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojQ0I3NUY2OyIgcG9pbnRzPSIyNzEsMjQwIDI3MSwzNjIgMjg5Ljc1LDM3NS43NDkgMjcxLDM5MiAyNzEsNTEyIDQyMiw1MTIgNDIyLDI0MCAiLz4KPHJlY3QgeD0iMjcxIiB5PSIzNjIiIHN0eWxlPSJmaWxsOiNERkQ3RDU7IiB3aWR0aD0iNjAiIGhlaWdodD0iMzAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==', // load your own custom marker image here
        iconSize: [56, 56],
        iconAnchor: [28, 28],
        popupAnchor: [0, -34]
      })); //reference marker
      L.marker(pos,{icon: icon}).addTo(map);
    });
    $('.leaflet-control a').remove();
  });
});
