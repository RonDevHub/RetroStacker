<script src="assets/js/game.js"></script>
    <script>
        // Einfacher Service-Worker Register für PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
    </script>
</body>
</html>