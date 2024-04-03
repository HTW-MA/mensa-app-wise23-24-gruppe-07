const urlBase64ToUint8Array = function(base64String: string) {
    let padding = "=".repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const showNotification = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/src/service-worker.ts")
            .then(function (registration) {
                console.log("Registered service worker.")
            })
            .catch(function (error) {
                console.log("Registration of service worker failed.")
            });
    }

    navigator.serviceWorker.ready.then(function (registration) {
        console.log("Service worker was found to be ready.")
        registration.showNotification("Test");
    });
}

const subscribeUserToNotifications = function() {
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            let subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array("BEz1Q_pBcwp0FszWT8xlf3ecUF2IqJA2qaGXR6OYFmWUODcgH5MXu0wZqONEzeAzYlFXS_6gsYsjA057ryiJsAo")
            }
            navigator.serviceWorker.ready.then(function (registration) {
                return registration.pushManager.subscribe(subscribeOptions)
            }).then(function(subscription) {
                let fetchOptions = {
                    method: "post",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify(subscription)
                };
                return fetch("/add-subscription", fetchOptions)
            });
        }
    });
}

const offerNotification = function() {
    if ("Notification" in window
        && "PushManager" in window
        && "serviceWorker" in navigator) {
        subscribeUserToNotifications();
    }
}

export const pushNotification = () => {
    let subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BEz1Q_pBcwp0FszWT8xlf3ecUF2IqJA2qaGXR6OYFmWUODcgH5MXu0wZqONEzeAzYlFXS_6gsYsjA057ryiJsAo")
    }

    navigator.serviceWorker.ready.then(function (registration) {
        return registration.pushManager.subscribe(subscribeOptions)
    }).then(function(subscription) {
        console.log(subscription)
    });

    /*
    if (Notification.permission == "granted") {
      showNotification()
    } else if (Notification.permission == "denied") {
      console.log("Notifications denied")
    } else if (Notification.permission == "default") {
      Notification.requestPermission().then(function (permission) {
        if (permission == "granted") {
          showNotification()
        } else if (permission == "denied") {
          console.log("Notifications denied")
        } else if (permission == "default") {
          console.log("Notifications can't be send, but can ask for permission again")
        }
      });
    }
     */
}