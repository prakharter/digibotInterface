/**
 * Created by Prakhar.Srivastava on 2017/07/27.
 */

function messengerReady() {
    // Wait until the messenger is fully
    // ready, then send a message
    FxoMessenger.on('stateChanged', function(state) {
        if (state === 'connected') {
            FxoMessenger.sendMessage('Hey!');
        }
    });

    // Subscribe to all messages received,
    // logging them to the console
    FxoMessenger.on('messageReceived', function(message) {
        console.log(message);
    });
}

function loadScript(url)
{
    // Adding the script tag to the head as suggested before
    var body = document.getElementsByTagName('body')[0];
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script['type'] = 'text/javascript';
    script['src'] = url;
    //script.setAttribute("data-fxo-widget" , "eyJ0aGVtZSI6IiM2ZmFjZjIiLCJ3ZWIiOnsiYm90SWQiOiI1OTQ5Mjg4ZTZlMmMwOTAwMGNjNTVhNDAiLCJ0aGVtZSI6IiM2ZmFjZjIiLCJsYWJlbCI6IldlbGNvbWUgdG8gRGlnaUJvdCJ9LCJ3ZWxjb21lVGV4dCI6IkRpZ2lCb3QifQ==")
    head.appendChild(script);

    var s = document.createElement('script');
    s.type = 'text/javascript';
    var code = "(function(p,u,s,h,x){p.pushpad=p.pushpad||function(){(p.pushpad.q=p.pushpad.q||[]).push(arguments)};h=u.getElementsByTagName('head')[0];x=u.createElement('script');x.async=1;x.src=s;h.appendChild(x);})(window,document,'https://pushpad.xyz/pushpad.js');pushpad('init', 4130);pushpad('subscribe');";
    try {
        s.appendChild(document.createTextNode(code));
        body.appendChild(s);
    } catch (e) {
        s.text = code;
        body.appendChild(s);
    }
    //script.setAttribute("data-fxo-widget" , "eyJ0aGVtZSI6IiM2ZmFjZjIiLCJ3ZWIiOnsiYm90SWQiOiI1OTQ5Mjg4ZTZlMmMwOTAwMGNjNTVhNDAiLCJ0aGVtZSI6IiM2ZmFjZjIiLCJsYWJlbCI6IldlbGNvbWUgdG8gRGlnaUJvdCJ9LCJ3ZWxjb21lVGV4dCI6IkRpZ2lCb3QifQ==")
    head.appendChild(script);
    var iframe = document.createElement('iframe');
    var script = document.createElement('div');
    script['style'] = 'position:fixed;bottom:2%;right:2%;height:500px;width: 300px;';
    iframe['src'] = 'https://fxo.io/m/arb7kped';
    iframe['width'] = '100%';
    iframe['height'] = '100%';
    iframe['style'] = 'border: 3px solid #f9f9fb; width: 100%; height: 100%;';
    script.appendChild(iframe);
    body.appendChild(script);
}
loadScript("https://pushpad.xyz/service-worker.js");

