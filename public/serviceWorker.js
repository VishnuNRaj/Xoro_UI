// import Cookies from "js-cookie";

this.addEventListener('push', (e) => {
    const data = e.data?.json();
    console.log('Push event received:', data);

    const title = data?.Message || 'Notification';
    const options = {
        body: data?.Text || 'Default body text',
        icon: data?.Link || '/default-icon.png',
        data: {
            url: data?.Redirect || '/'
        }
    };

    e.waitUntil(
        this.registration.showNotification(title, options)
    );
});

this.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const redirectUrl = event.notification.data.url;

    event.waitUntil(
        this.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === redirectUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (this.clients.openWindow) {
                console.log('Token found, opening redirect URL:', redirectUrl);
                return this.clients.openWindow(redirectUrl);
            }
        })
    );
});
