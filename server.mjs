import http from 'http';
import qs from 'querystringify';
import fs from 'fs';

const messagesString = fs.readFileSync('messages.json', {encoding: 'UTF-8'});//fs- comes with node, we don't need to install anything extra
                                                                             //tels to read the 'messages.json' file which 
                                                                             //is presented as an array (our choise)
                                                                      
const messages = JSON.parse(messagesString);//takes a string and returns an object

const server = http.createServer(
    (request, response) => { 
        const queryString = request.url.replace('/', '');//querystringify downloaded- returns urlrequest without / sign 
        //console.log(queryString); ---> (?name=Anna&message=bla+bla)
        const params = qs.parse(queryString);//takes the string and returns an object
        //console.log(params);---> { name: 'Anna', message: 'bla bla' }
        if(params.message) {//the 'message' is the input that we typed in, name. 
                            //is what we get when typing the request (can see it in the url line in the broweser)({ name: 'Anna', message: 'bla bla' })
            messages.push({//we push the new object to the messagesString array 
              name: params.name,  
              text: params.message,
              time: new Date(),
            });

            fs.writeFileSync(//we write the object in the 'messages.json' file
                'messages.json', 
                JSON.stringify(messages), //we convert the object to a string (now we have an array of strings writen in the file)
                { encoding: 'UTF-8' }
            );

        }

        const messagesList = messages.map(message => //each message we create we turn to a string and add it to 'index.html' file, so next time 
                                                    // we kill the server, our messages will be stored and read again
            `<p>${message.name}: ${message.text} (${message.time})</p>`).join('');
        let HTMLString = fs.readFileSync('index.html', {encoding: 'UTF-8'});
        HTMLString = HTMLString.replace('REPLACE_ME', messagesList);

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(HTMLString);
        response.end();
    }
);

server.listen(8080);

console.log('Listening on: http://localhost:8080');

// Statefull - A server with a running living state
// Stateless - A server without a running state,
//             state is saved in an external resource
