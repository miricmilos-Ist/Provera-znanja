const http = require('http');
const url = require('url');
const querystring = require('query-string');

const lista = [
    {
        id: 0,
        naziv: "Smoki",
        cena: 130,
        imeKompanije: "SokoStark"
    },
    {
        id: 1,
        naziv: "Mars",
        cena: 85,
        imeKompanije: "CandyShop"
    },
    {
        id: 2,
        naziv: "TortillaChips",
        cena: 250,
        imeKompanije: "SokoStark"
    }
];

http.createServer((req, res) => {
    let urlobj = url.parse(req.url, true, false);
    if (req.method == "GET") {
        if (urlobj.pathname == "/") {
            response = sviArtikli(urlobj.query.kompanija);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi artikli</title>
                </head>
                <body>
                    <h1>Artikli</h1>
                    <hr>

                    <section id="sviartikli">
            `);
            for(let a of response) {
                res.write(`
                    ${a.naziv} | ${a.cena} | ${a.imeKompanije} | 
                    <form action='/obrisi?id=${a.id}' method="POST">
                        <button type="submit">Obrisi</button>
                    </form>
                `);
            }
            res.end(`<hr> <a href = '/dodaj'> Novi artikal</a> 
                </section>
            </body > 
            </html >`);
        }
        
        if(urlobj.pathname == "/dodaj")
        {
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Svi artikli</title>
                </head>
                <body>


                <form action="/dodaj" method="POST">
                    <input type="number" name="id" placeholder="id"><br>
                    <input type="text" name="naziv" placeholder="naziv"><br>
                    <input type="number" name="cena" placeholder="cena"><br>
                    <input type="text" name="imeKompanije" placeholder="imeKompanije"><br>
                    <hr>
                    <button type="submit">Dodaj</button>
                </form>

                </body>
                </html>
            `);
        }    
    }
    if(req.method == "POST")
    {
        if(urlobj.pathname == "/dodaj")
        {
            var body = '';
            req.on('data', function (data) {
                body += data;
                console.log(body);
            });

            req.on('end', function () {
                dodajArtikal(querystring.parse(body).id, querystring.parse(body).naziv,
                    querystring.parse(body).cena, querystring.parse(body).imeKompanije);
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
            });
        }
    }
}).listen(8080);

function sviArtikli(kompanija) {
    let result = lista.filter(a => a.imeKompanije == kompanija);
    if(result.length == 0){
        return lista;
    }
    return result;
}
function dodajArtikal(id, naziv, cena, imeKompanije)
{
    let artikal = {
        'id': id,
        'naziv': naziv,
        'cena': cena,
        'imeKompanije': imeKompanije
    };
    lista.push(artikal);
}