// Requerimiento 03
const axios = require('axios')
const http = require('http')
const fs = require('fs')
const port = 3000
http
.createServer(function (req, res) {
    if (req.url.startsWith('/imagenes')) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.readFile('index.html', 'utf8', (err, html) => {
        res.write(html)
        res.end()
      })
    }
    if (req.url.startsWith('/pokemones')) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
            // Requerimiento 02 Crear una función asincrona
            let pokemones = []
            // Requerimiento 01 Uso de función async/await
            async function pokemonesGet() {
                const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150')
                return data.results
              }
    
            console.log(pokemonesGet())
            async function getFullData(name) {
                const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
                return data
            }
            // Requerimiento 02 uso de promise.all
            pokemonesGet().then((results) => {
                results.forEach((p) => {
                  let pokemonName = p.name
                  pokemones.push(getFullData(pokemonName))
                })
                Promise.all(pokemones).then((data) => {
                    let dataFiltrada = []
                    data.forEach((d) => {
                      let img = d.sprites.front_default
                      let nombre = d.name
                      dataFiltrada.push({ img, nombre })
                    })
                    res.write(JSON.stringify(dataFiltrada))
                    res.end()
                  }).catch(e => console.log(e))
                })
              }
})
.listen(`${port}`, console.log(`Escuchando puerto ${port}`))