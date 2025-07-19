const CACHE_NAME = 'diogow-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/styles/header.css',
  '/styles/home.css',
  '/styles/about.css',
  '/styles/tech.css',
  '/styles/footer.css',
  '/javascript/script.js',
  '/src/images/eu.png',
  '/src/images/wave.svg',
  '/src/images/icons/java-icon.png',
  '/src/images/icons/javascript-icon.png',
  '/src/images/icons/php-icon.png',
  '/src/images/icons/python-logo.png',
  '/src/images/icons/react-icon.png',
  '/src/images/icons/typescript-logo.png',
  '/src/images/icons/html-logo.png',
  '/src/images/icons/css-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://unpkg.com/scrollreveal',
  'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 