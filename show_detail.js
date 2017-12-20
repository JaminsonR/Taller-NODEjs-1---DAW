var express = require('express');
var app = express();
var fs = require("fs");
var csv = require("fast-csv");



app.get('/', function (req, res) {
   var promises = []
   var salida;
   var llegada;
   //aerolineas que vuelan a russia
  
  promises.push(
      getAirlinesD("Russia").then( result => {
         salida=result;
       console.log(result)
       //res.end(result);
      })
   )

  //aerolineas que vuelan desde russia
  promises.push(
     getAirlinesP("Russia").then( result => {
       console.log(result)
       llegada=result
      })
   )
    
   Promise.all(promises).then( () =>{
      res.end( "Aerolineas que vuelan desde y hacia Russia:\n" + salida +" \n" + llegada);
   })

 }) 


function getRoutes(){
   return new Promise( (resolve, reject) => {
      return fs.readFile( __dirname + "/" + "routes.dat.txt", 'utf8', function (err, csv) {
         if(err){
            return reject(err)
         }

         var data = csvJSON(csv);
         var routes = JSON.parse( data );
         //console.log(routes)
         return resolve(routes);
      });
   });
   
   
}

function getAirports(){
   return new Promise( (resolve, reject) => {
      fs.readFile( __dirname + "/" + "airports.dat.txt", 'utf8', function (err, csv) {
         if(err){
            return reject(err)
         }
            var data = csvJSON(csv);
            var airports = JSON.parse( data );
            //console.log(routes)
         return resolve(airports);
      });
   });
}


function getAirlines(){
   return new Promise( (resolve, reject) => {
      fs.readFile( __dirname + "/" + "airlines.dat.txt", 'utf8', function (err, csv) {
      if(err){
            return reject(err)
         }
         var data = csvJSON(csv);
         var airlines = JSON.parse( data );
         //console.log(routes)
         return resolve(airlines);
      });
   });

}



//selecciono todas las aerolineas que viajan a un aeropuerto
function getDestinations(airportId){
   return new Promise( (resolve, reject) => {
      var destinations = []
      getRoutes()
      .then( routes => {
         
         for(var route in routes){
            if (removeQuotes(routes[route]['Destination airport ID'].toLowerCase()) == removeQuotes(airportId.toLowerCase())){
               
                  destinations.push(routes[route]['Airline ID']);
               
               
               //console.log(destinations)

            }
             
         }
        return resolve(new Set(destinations));
         
       })
       .catch( err => {
         console.log('Algo salio mal')
         console.log(err)
       })
      
       
      });
      

      
}


//selecciono todas las aerolineas que viajan desde un aeropuerto
function getDepartures(airportId){
   return new Promise( (resolve, reject) => {
      var destinations = []
      getRoutes()
      .then( routes => {
         
         for(var route in routes){
            if (removeQuotes(routes[route]['Source airport ID'].toLowerCase()) == removeQuotes(airportId.toLowerCase())){
               
                  destinations.push(routes[route]['Airline ID']);
               
               
               //console.log(destinations)

            }
             
         }
        return resolve(new Set(destinations));
         
       })
       .catch( err => {
         console.log('Algo salio mal')
         console.log(err)
       })
      
       
      });
      

      
}

function getAirportName(id){
   getAirports()
   .then( airports => {
      
         for(var index in airports){
            if (removeQuotes(airports[index]['Airport ID'].toLowerCase()) == removeQuotes(id.toLowerCase())){
               return airports[index]['Name'];
            }
             
         }
   })
   .catch( err => {
      console.log('Algo salio mal')
      console.log(err)
    })

   return "none";
}



// Devuelve los ID de todos las aerolineas que viajan A un Pais (destino)
function getAirlinesD(pais){
   return new Promise( (resolve, reject) => {

      var aerolineas = [];
      var er = "";
      var promises = [];
      getAirports()
      .then( airports => {
         var select = []
         //selecciono todas los aeropuertos de un pais
         for (var airport in airports){
            //console.log(pais.toLowerCase())
            //er = airports[airport]
            //console.log(airports[airport]['Airport ID'])
            
            if (removeQuotes(airports[airport]['Country'].toLowerCase()) == pais.toLowerCase()){
               //console.log(airports[airport]['Country'])
               select.push(airports[airport]['Airport ID']);
            }
         }


         //selecciono las aerolineas que viajan a los aeropuertos de un pais
         for (let i = 0; i < select.length; i++) {
            
            //console.log(!aerolineas.includes(select[i]))
            
               promises.push(
                  getDestinations(select[i]).then( destino => {

                        for (let id of destino){
                           
                              aerolineas.push(id);
                           
                           
                        }
                        
                        
                     })
                  .catch( err => {
                 
                  
                     console.log('Algo salio mal')
                     console.log(err)
                  })
               //console.log("holi boli")
               )
            
            
         }
         //console.log(aerolineas)
         //espero a que termine de llenarse aerolineas para retornar la funcion
        Promise.all(promises).then( ()=> {
         return resolve (new Set(aerolineas))
         });

      })

      .catch( err => {
         //console.log(pais.toLowerCase())
         console.log(er + "aquii")
         console.log('Algo salio mal')
         console.log(err)
       })
      
   })
}

// Devuelve los ID de todos las aerolineas que viajan desde un Pais (partida)
function getAirlinesP(pais){
   return new Promise( (resolve, reject) => {

      var aerolineas = [];
      var er = "";
      var promises = [];
      getAirports()
      .then( airports => {
         var select = []
         //selecciono todas los aeropuertos de un pais
         for (var airport in airports){
            //console.log(pais.toLowerCase())
            //er = airports[airport]
            //console.log(airports[airport]['Airport ID'])
            
            if (removeQuotes(airports[airport]['Country'].toLowerCase()) == pais.toLowerCase()){
               //console.log(airports[airport]['Country'])
               select.push(airports[airport]['Airport ID']);
            }
         }


         //selecciono las aerolineas que viajan a los aeropuertos de un pais
         for (let i = 0; i < select.length; i++) {
            
            //console.log(!aerolineas.includes(select[i]))
            
               promises.push(
                  getDepartures(select[i]).then( destino => {

                        for (let id of destino){
                           
                              aerolineas.push(id);
                           
                           
                        }
                        
                        
                     })
                  .catch( err => {
                 
                  
                     console.log('Algo salio mal')
                     console.log(err)
                  })
               //console.log("holi boli")
               )
            
            
         }
         //console.log(aerolineas)
         //espero a que termine de llenarse aerolineas para retornar la funcion
        Promise.all(promises).then( ()=> {
         return resolve (new Set(aerolineas))
         });

      })

      .catch( err => {
         //console.log(pais.toLowerCase())
         console.log(er + "aquii")
         console.log('Algo salio mal')
         console.log(err)
       })
      
   })
}

function removeQuotes(str){
   return str.replace(/"+/g, '');
}

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})


function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

     var obj = {};
     var currentline=lines[i].split(",");

     for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
     }

     result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}