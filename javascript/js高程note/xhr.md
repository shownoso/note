
### readyState
UNSENT 0  open未调用
OPENED 1 open已调用
HEADERS_RECEIVED 2 接收到头信息
LOADING 3 接收到响应主体
DONE 4 相应完成



### 请求
1. 使用encodeURIComponent实现encodeFormData
```js
function encodeFormData(data) {
  if (!data) return "";    // Always return a string
  var pairs = [];          // To hold name=value pairs
  for(var name in data) {                                  // For each name
    if (!data.hasOwnProperty(name)) continue;            // Skip inherited
    if (typeof data[name] === "function") continue;      // Skip methods
    var value = data[name].toString();                   // Value as string
    name = encodeURIComponent(name.replace(" ", "+"));   // Encode name
    value = encodeURIComponent(value.replace(" ", "+")); // Encode value
    pairs.push(name + "=" + value);   // Remember name=value pair
  }
  return pairs.join('&'); // Return joined pairs separated with &
}

```
2. 使用encodeFormData 
```js
function postData(url, data, callback) {
  var request = new XMLHttpRequest();            
  request.open("POST", url);                    // POST to the specified url
  request.onreadystatechange = function() {     // Simple event handler
      if (request.readyState === 4 && callback) // When response is complete
          callback(request);                    // call the callback.
  };
  // 必须显式设置
  request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");// Set Content-Type
  request.send(encodeFormData(data));           // Send form-encoded data
}
```
3. JSON 
```js
function postJSON(url, data, callback) {
  var request = new XMLHttpRequest();            
  request.open("POST", url);                    // POST to the specified url
  request.onreadystatechange = function() {     // Simple event handler
    if (request.readyState === 4 && callback) // When response is complete
      callback(request);                    // call the callback.
  };
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}

```
4. XML
```js
function postQuery(url, what, where, radius, callback) {
  var request = new XMLHttpRequest();            
  request.open("POST", url);                  // POST to the specified url
  request.onreadystatechange = function() {   // Simple event handler
      if (request.readyState === 4 && callback) callback(request);
  };

  // Create an XML document with root element <query>
  var doc = document.implementation.createDocument("", "query", null);
  var query = doc.documentElement;            // The <query> element
  var find = doc.createElement("find");       // Create a <find> element
  query.appendChild(find);                    // And add it to the <query>
  find.setAttribute("zipcode", where);        // Set attributes on <find>
  find.setAttribute("radius", radius);
  find.appendChild(doc.createTextNode(what)); // And set content of <find>

  // Now send the XML-encoded data to the server.
  // Note that the Content-Type will be automatically set.
  // 请求头中Content-Type会被request自动设置合适的请求头  text/xml
  request.send(doc); 
}
```

5. file
文件是Blob类型的一个子类型 ，xhr允许在send中传入任何Blob对象
```js
function autoUpload() {                        // Run when the document is ready
  var elts = document.getElementsByTagName("input"); // All input elements
  for(var i = 0; i < elts.length; i++) {             // Loop through them
    var input = elts[i];
    if (input.type !== "file") continue;  // Skip all but file upload elts
    var url = input.getAttribute("data-uploadto"); // Get upload URL
    if (!url) continue;                   // Skip any without a url

    input.addEventListener("change", function() {  // When user selects file
      var file = this.files[0];         // Assume a single file selection
      if (!file) return;                // If no file, do nothing
      var xhr = new XMLHttpRequest();   // Create a new request
      xhr.open("POST", url);            // POST to the URL
      xhr.send(file);                   // Send the file as body
    }, false);
  }
};
```

6. 多元的表单 包含文件元素及其它

```js
function postFormData(url, data, callback) {
  if (typeof FormData === "undefined")
      throw new Error("FormData is not implemented");

  var request = new XMLHttpRequest();            // New HTTP request
  request.open("POST", url);                     // POST to the specified url
  request.onreadystatechange = function() {      // A simple event handler.
    if (request.readyState === 4 && callback)  // When response is complete
        callback(request);                     // ...call the callback.
  };
  var formdata = new FormData();
  for(var name in data) {
    if (!data.hasOwnProperty(name)) continue;  // Skip inherited properties
    var value = data[name];
    if (typeof value === "function") continue; // Skip methods
    // Each property becomes one "part" of the request.
    // File objects are allowed here
    formdata.append(name, value);              // Add name/value as one part
  }
  // Send the name/value pairs in a multipart/form-data request body. Each
  // pair is one part of the request. Note that send automatically sets
  // the Content-Type header when you pass it a FormData object
  request.send(formdata);  
}
```

### 请求进度
xhr的progress事件
loaded 已经传输的字节
total 包含"Content-Length"头传输的数据的整体长度（字节）
```js
request.onprogress = function(e) {
  if( e.lengthComputable) {
    console.log(Math.round(100 * e.loaded / e.total) + '%');
  }
}
```
```js
// Find all elements of class "fileDropTarget" and register DnD event handlers
// to make them respond to file drops.  When files are dropped, upload them to 
// the URL specified in the data-uploadto attribute.
whenReady(function() {
    var elts = document.getElementsByClassName("fileDropTarget");
    for(var i = 0; i < elts.length; i++) {
        var target = elts[i];
        var url = target.getAttribute("data-uploadto");
        if (!url) continue;
        createFileUploadDropTarget(target, url);
    }

    function createFileUploadDropTarget(target, url) {
        // Keep track of whether we're currently uploading something so we can
        // reject drops. We could handle multiple concurrent uploads, but 
        // that would make progress notification too tricky for this example.
        var uploading = false; 

        console.log(target, url);

        target.ondragenter = function(e) {
            console.log("dragenter");
            if (uploading) return;  // Ignore drags if we're busy
            var types = e.dataTransfer.types;
            if (types && 
                ((types.contains && types.contains("Files")) ||
                 (types.indexOf && types.indexOf("Files") !== -1))) {
                target.classList.add("wantdrop");
                return false;
            }
        };
        target.ondragover = function(e) { if (!uploading) return false; };
        target.ondragleave = function(e) {
            if (!uploading) target.classList.remove("wantdrop");
        };
        target.ondrop = function(e) {
            if (uploading) return false;
            var files = e.dataTransfer.files;
            if (files && files.length) {
                uploading = true;
                var message = "Uploading files:<ul>";
                for(var i = 0; i < files.length; i++) 
                    message += "<li>" + files[i].name + "</li>";
                message += "</ul>";
                
                target.innerHTML = message;
                target.classList.remove("wantdrop");
                target.classList.add("uploading");
                
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                var body = new FormData();
                for(var i = 0; i < files.length; i++) body.append(i, files[i]);
                xhr.upload.onprogress = function(e) {
                    if (e.lengthComputable) {
                        target.innerHTML = message +
                            Math.round(e.loaded/e.total*100) +
                            "% Complete";
                    }
                };
                xhr.upload.onload = function(e) {
                    uploading = false;
                    target.classList.remove("uploading");
                    target.innerHTML = "Drop files to upload";
                };
                xhr.send(body);

                return false;
            }
            target.classList.remove("wantdrop");
        }
    }
});

```


#### 中止请求和超时

```js
function timedGetText(url, timeout, callback) {
  var request = new XMLHttpRequest();         // Create new request.
  var timedout = false;                       // Whether we timed out or not.
  // Start a timer that will abort the request after timeout ms.
  var timer = setTimeout(function() {         // Start a timer. If triggered,
    timedout = true; // set a flag and then
    request.abort(); // abort the request.
  }, timeout);            // How long before we do this
  request.open("GET", url);                   // Specify URL to fetch
  request.onreadystatechange = function() {   // Define event listener.
      if (request.readyState !== 4) return;   // Ignore incomplete requests.
      if (timedout) return;                   // Ignore aborted requests.
      clearTimeout(timer);                    // Cancel pending timeout.
      if (request.status === 200)             // If request was successful
          callback(request.responseText);     // pass response to callback.
  };
  request.send(null);                         // Send the request now
}

```


#### 跨域请求

1. HEAD + CORS
```js
function() { 
    // Is there any chance that cross-origin requests will succeed?
    var supportsCORS = (new XMLHttpRequest()).withCredentials !== undefined;

    // Loop through all links in the document
    var links = document.getElementsByTagName('a');
    for(var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.href) continue; // Skip anchors that are not hyperlinks
        if (link.title) continue; // Skip links that already have tooltips

        // If this is a cross-origin link
        if (link.host !== location.host || link.protocol !== location.protocol)
        {
            link.title = "Off-site link";  // Assume we can't get any more info 
            if (!supportsCORS) continue;   // Quit now if no CORS support
            // Otherwise, we might be able to learn more about the link
            // So go ahead and register the event handlers so we can try.
        }

        // Register event handler to download link details on mouse over
        if (link.addEventListener)
            link.addEventListener("mouseover", mouseoverHandler, false);
        else
            link.attachEvent("onmouseover", mouseoverHandler);
    }

    function mouseoverHandler(e) {
        var link = e.target || e.srcElement;      // The <a> element
        var url = link.href;                      // The link URL

        var req = new XMLHttpRequest();           // New request
        req.open("HEAD", url);                    // Ask for just the headers
        req.onreadystatechange = function() {     // Event handler
            if (req.readyState !== 4) return;     // Ignore incomplete requests
            if (req.status === 200) {             // If successful
                var type = req.getResponseHeader("Content-Type");   // Get
                var size = req.getResponseHeader("Content-Length"); // link
                var date = req.getResponseHeader("Last-Modified");  // details
                // Display the details in a tooltip. 
                link.title = "Type: " + type + "   \n" +  
                    "Size: " + size + "   \n" + "Date: " + date;
            }
            else {
                // If request failed, and the link doesn't already have an
                // "Off-site link" tooltip, then display the error.
                if (!link.title)
                    link.title = "Couldn't fetch details: \n" +
                        req.status + " " + req.statusText;
            }
        };
        req.send(null);
        
        // Remove handler: we only want to fetch these headers once.
        if (link.removeEventListener)
            link.removeEventListener("mouseover", mouseoverHandler, false);
        else
            link.detachEvent("onmouseover", mouseoverHandler);
    }
}
```

2. JSONP

```js
function getJSONP(url, callback) {
    // Create a unique callback name just for this request
    var cbnum = "cb" + getJSONP.counter++; // Increment counter each time
    var cbname = "getJSONP." + cbnum;      // As a property of this function
    
    // Add the callback name to the url query string using form-encoding
    // We use the parameter name "jsonp".  Some JSONP-enabled services 
    // may require a different parameter name, such as "callback".
    if (url.indexOf("?") === -1)   // URL doesn't already have a query section
        url += "?jsonp=" + cbname; // add parameter as the query section
    else                           // Otherwise, 
        url += "&jsonp=" + cbname; // add it as a new parameter.

    // Create the script element that will send this request
    var script = document.createElement("script");

    // Define the callback function that will be invoked by the script
    getJSONP[cbnum] = function(response) {
        try {
            callback(response); // Handle the response data
        }
        finally {               // Even if callback or response threw an error
            delete getJSONP[cbnum];                // Delete this function
            script.parentNode.removeChild(script); // Remove script
        }
    };

    // Now trigger the HTTP request
    script.src = url;                  // Set script url
    document.body.appendChild(script); // Add it to the document
}

getJSONP.counter = 0;  // A counter we use to create unique callback names

```

3. 服务器端推送事件- comet
  - EventSource
```js
window.onload = function() {
    // Take care of some UI details
    var nick = prompt("Enter your nickname");     // Get user's nickname
    var input = document.getElementById("input"); // Find the input field
    input.focus();                                // Set keyboard focus

    // Register for notification of new messages using EventSource
    var chat = new EventSource("/chat");
    chat.onmessage = function(event) {            // When a new message arrives
        var msg = event.data;                     // Get text from event object
        var node = document.createTextNode(msg);  // Make it into a text node
        var div = document.createElement("div");  // Create a <div>
        div.appendChild(node);                    // Add text node to div
        document.body.insertBefore(div, input);   // And add div before input
        input.scrollIntoView();                   // Ensure input elt is visible
    }

    // Post the user's messages to the server using XMLHttpRequest
    input.onchange = function() {                 // When user strikes return
        var msg = nick + ": " + input.value;      // Username plus user's input
        var xhr = new XMLHttpRequest();           // Create a new XHR
        xhr.open("POST", "/chat");                // to POST to /chat.
        xhr.setRequestHeader("Content-Type",      // Specify plain UTF-8 text 
                             "text/plain;charset=UTF-8");
        xhr.send(msg);                            // Send the message
        input.value = "";                         // Get ready for more input
    }
};
```
  - xhr模拟EventSource
```js
if (window.EventSource === undefined) {     // If EventSource is not defined,
    window.EventSource = function(url) {    // emulate it like this.
        var xhr;                        // Our HTTP connection...
        var evtsrc = this;              // Used in the event handlers.
        var charsReceived = 0;          // So we can tell what is new.
        var type = null;                // To check property response type.
        var data = "";                  // Holds message data
        var eventName = "message";      // The type field of our event objects
        var lastEventId = "";           // For resyncing with the server
        var retrydelay = 1000;          // Delay between connection attempts
        var aborted = false;            // Set true to give up on connecting

        // Create an XHR object
        xhr = new XMLHttpRequest(); 

        // Define an event handler for it
        xhr.onreadystatechange = function() {
            switch(xhr.readyState) {
            case 3: processData(); break;   // When a chunk of data arrives
            case 4: reconnect(); break;     // When the request closes
            }
        };

        // And establish a long-lived connection through it
        connect();

        // If the connection closes normally, wait a second and try to restart
        function reconnect() {
            if (aborted) return;             // Don't reconnect after an abort
            if (xhr.status >= 300) return;   // Don't reconnect after an error
            setTimeout(connect, retrydelay); // Wait a bit, then reconnect
        };

        // This is how we establish a connection
        function connect() {
            charsReceived = 0; 
            type = null;
            xhr.open("GET", url);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            if (lastEventId) xhr.setRequestHeader("Last-Event-ID", lastEventId);
            xhr.send();
        }

        // Each time data arrives, process it and trigger the onmessage handler
        // This function handles the details of the Server-Sent Events protocol
        function processData() {
            if (!type) {   // Check the response type if we haven't already
                type = xhr.getResponseHeader('Content-Type');
                if (type !== "text/event-stream") {
                    aborted = true;
                    xhr.abort();
                    return; 
                }
            }
            // Keep track of how much we've received and get only the
            // portion of the response that we haven't already processed.
            var chunk = xhr.responseText.substring(charsReceived);
            charsReceived = xhr.responseText.length;

            // Break the chunk of text into lines and iterate over them.
            var lines = chunk.replace(/(\r\n|\r|\n)$/, "").split(/\r\n|\r|\n/);
            for(var i = 0; i < lines.length; i++) {
                var line = lines[i], pos = line.indexOf(":"), name, value="";
                if (pos == 0) continue;               // Ignore comments
                if (pos > 0) {                        // field name:value
                    name = line.substring(0,pos);
                    value = line.substring(pos+1);
                    if (value.charAt(0) == " ") value = value.substring(1);
                }
                else name = line;                     // field name only

                switch(name) {
                case "event": eventName = value; break;
                case "data": data += value + "\n"; break;
                case "id": lastEventId = value; break;
                case "retry": retrydelay = parseInt(value) || 1000; break; 
                default: break;  // Ignore any other line
                }

                if (line === "") {  // A blank line means send the event
                    if (evtsrc.onmessage && data !== "") {
                        // Chop trailing newline if there is one
                        if (data.charAt(data.length-1) == "\n")
                            data = data.substring(0, data.length-1);
                        evtsrc.onmessage({    // This is a fake Event object
                            type: eventName,  // event type
                            data: data,       // event data
                            origin: url       // the origin of the data
                        });
                    }
                    data = "";
                    continue;
                }
            }
        }
    };
}
```

  - 使用服务端（node）处理
```js
var http = require('http');  // NodeJS HTTP server API

// The HTML file for the chat client. Used below.
var clientui = require('fs').readFileSync("chatclient.html");
var emulation = require('fs').readFileSync("EventSourceEmulation.js");

// An array of ServerResponse objects that we're going to send events to
var clients = [];

// Send a comment to the clients every 20 seconds so they don't 
// close the connection and then reconnect
setInterval(function() {
    clients.forEach(function(client) {
        client.write(":ping\n");
    });
}, 20000);

// Create a new server
var server = new http.Server();  

// When the server gets a new request, run this function
server.on("request", function (request, response) {
    // Parse the requested URL
    var url = require('url').parse(request.url);

    // If the request was for "/", send the client-side chat UI.
    if (url.pathname === "/") {  // A request for the chat UI
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("<script>" + emulation + "</script>");
        response.write(clientui);
        response.end();
        return;
    }
    // Send 404 for any request other than "/chat"
    else if (url.pathname !== "/chat") {
        response.writeHead(404);
        response.end();
        return;
    }

    // If the request was a post, then a client is posting a new message
    if (request.method === "POST") {
        request.setEncoding("utf8");
        var body = "";
        // When we get a chunk of data, add it to the body
        request.on("data", function(chunk) { body += chunk; });

        // When the request is done, send an empty response 
        // and broadcast the message to all listening clients.
        request.on("end", function() {
            response.writeHead(200);   // Respond to the request
            response.end();

            // Format the message in text/event-stream format
            // Make sure each line is prefixed with "data:" and that it is
            // terminated with two newlines.
            message = 'data: ' + body.replace('\n', '\ndata: ') + "\r\n\r\n";
            // Now send this message to all listening clients
            clients.forEach(function(client) { client.write(message); });
        });
    }
    // Otherwise, a client is requesting a stream of messages
    else {
        // Set the content type and send an initial message event 
        response.writeHead(200, {'Content-Type': "text/event-stream" });
        response.write("data: Connected\n\n");

        // If the client closes the connection, remove the corresponding
        // response object from the array of active clients
        request.connection.on("end", function() {
            clients.splice(clients.indexOf(response), 1);
            response.end();
        });

        // Remember the response object so we can send future messages to it
        clients.push(response);
    }
});

// Run the server on port 8000. Connect to http://localhost:8000/ to use it.
server.listen(8000);

```

### 响应
响应处理
```js
// 根据响应头中内容类型处理返回结果
function get(url, callback) {
  var request = new XMLHttpRequest();         // Create new request
  request.open("GET", url);                   // Specify URL to fetch
  request.onreadystatechange = function() {   // Define event listener
    // If the request is compete and was successful
    if (request.readyState === 4 && request.status === 200) {
      // Get the type of the response
      var type = request.getResponseHeader("Content-Type");
      // Check type so we don't get HTML documents in the future
      if (type.indexOf("xml") !== -1 && request.responseXML) 
          callback(request.responseXML);              // Document response
      else if (type === "application/json")
          callback(JSON.parse(request.responseText)); // JSON response
      else 
          callback(request.responseText);             // String response
    }
  };
  request.send(null);                         // Send the request now
}

```


request.overrideMimeType 指定一个MIME类型用于替代服务器指定的类型，使服务端响应信息中传输的数据按照该指定MIME类型处理。
兼容性
```js
if (!window.XMLHttpRequest) {
  window.XMLHttpRequest = function () {
    try{
      return new ActiveXObject('Msxml2.XMHTTP.6.0');
    } catch(e1) {
      
      try{
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      }catch(e2) {
        throw new Error('XMLHttpRequest is not supported')
      } 
    }
  }
}
```

