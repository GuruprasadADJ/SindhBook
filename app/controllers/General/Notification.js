const methods={};
methods.notify =function(device, title, body){
    console.log("getting variables ","device: ",device+ "\n"+"title :",title+"\n"+"body :",body);
    var FCM = require('fcm-node');
    var serverKey = 'AAAAbYE2_zI:APA91bHpSd0DZ25MMpEOhOiQfBzAgpCbqtQtBbpvJJyxLswjHzmX372Ck7Oo5AHT_BuiUuVbmQhcQa48uZ2WqURPigHmajStwPWoTbJLDOcvifKaeTjChwLyghEZFj2WcUxr944dYHQBGNWxHvpwBtYvA3KFfhtsRQ'; //put your server key here
    var fcm = new FCM(serverKey);
    var message = { 
        to: device, 
        // collapse_key: 'your_collapse_key',
        
        // notification: {
        // title: 'Test Notification', 
        // message: 'Hello World' ,
        // order_id:'7485asdf'
        // }//, 
        data: {
            // my_key: 'my value',
            // my_another_key: 'my another value'
            title: title||"title", 
            body: body||"body",
        }
    };
    fcm.send(message, function(err, response){
        if (err) {
          console.log("Something has gone wrong!"+err);
        } else {
         console.log("Successfully sent with response: ", response);
        }
    });
}

module.exports = methods;



