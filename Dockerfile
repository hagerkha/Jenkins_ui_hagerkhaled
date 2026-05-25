FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY style.css  /usr/share/nginx/html/style.css
COPY script.js  /usr/share/nginx/html/script.js
COPY image.png  /usr/share/nginx/html/image.png

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
