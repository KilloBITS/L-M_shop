
    var i = 799;
    mongoClient.connect(global.baseIP, { useNewUrlParser: true } ,function(err, client){
     const db = client.db(global.baseName);
     const tovar  = db.collection("tovar");
     if(err) return console.log(err);

     tovar.find().toArray(function(err, results_tovar ){
       setInterval(function(){

         console.log(results_tovar[i].title);

         var newLink = []
         if(results_tovar[i].image[0].split('/')[0] == 'https:'){
           for(var da = 0; da < results_tovar[i].image.length; da ++){
             newLink.push(results_tovar[i].image[da].slice(46))
           }
           tovar.updateOne( { vendorCode : results_tovar[i].vendorCode },{ $set : { image: newLink}});
           results_tovar[i].image = newLink
         }
         console.log(results_tovar[i].image)

       if(results_tovar[i].image.length === 1){
         var testName = results_tovar[i].image[0].split('/');
         var dir = 'publick/data/tovar/'+testName[0];
         if (!fs.existsSync(dir)){
           console.log('Создаем папку')
              fs.mkdirSync(dir);
          }
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
             .on('response', function(response) {

             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file);
             } else {
               console.log("FAIL");
             }
          });
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);
       }

       /*************************************************/

       if(results_tovar[i].image.length === 2){
         var testName = results_tovar[i].image[0].split('/');

         var dir = 'publick/data/tovar/'+testName[0];
         if (!fs.existsSync(dir)){
           console.log('Создаем папку')
              fs.mkdirSync(dir);
          }
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file);
             } else {
               console.log("FAIL");
             }
          });
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);

         //2
         var testName2 = results_tovar[i].image[1].split('/');
         var dir2 = 'publick/data/tovar/'+testName2[0];

         if (!fs.existsSync(dir2)){
           console.log('Создаем папку')
              fs.mkdirSync(dir2);
          }
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[1], "rejectUnauthorized": false})
             .on('response', function(response) {

             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file2);
             } else {
               console.log("FAIL");
             }
          });
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1]);
       }

       if(results_tovar[i].image.length === 3){

         //1
         var testName = results_tovar[i].image[0].split('/');
         var dir = 'publick/data/tovar/'+testName[0];
         if (!fs.existsSync(dir)){
           console.log('Создаем папку')
              fs.mkdirSync(dir);
          }
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file);
             } else {
               console.log("FAIL");
             }
          });
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);

         //2
         var testName2 = results_tovar[i].image[1].split('/');
         var dir2 = 'publick/data/tovar/'+testName2[0];
         if (!fs.existsSync(dir2)){
           console.log('Создаем папку')
              fs.mkdirSync(dir2);
          }
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[1], "rejectUnauthorized": false})
             .on('response', function(response) {

             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file2);
             } else {
               console.log("FAIL");
             }
          });
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1]);

         //3
         var testName3 = results_tovar[i].image[2].split('/');
         var dir3 = 'publick/data/tovar/'+testName3[0];
         if (!fs.existsSync(dir3)){
           console.log('Создаем папку')
              fs.mkdirSync(dir3);
          }
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[2], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file3);
             } else {
               console.log("FAIL");
             }
          });
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1]);
       }





       if(results_tovar[i].image.length === 4){
         // try {
           var testName = results_tovar[i].image[0].split('/');
           var dir = 'publick/data/tovar/'+testName[0];
           if (!fs.existsSync(dir)){
             console.log('Создаем папку')
                fs.mkdirSync(dir);
            }
           var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
           request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
               .on('response', function(response) {
               if (response.statusCode === 200) {
                 console.log("DONE");
                 response.pipe(file);
               } else {
                 console.log("FAIL");
               }
            });
           var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);

           //2
           var testName2 = results_tovar[i].image[1].split('/');
           var dir2 = 'publick/data/tovar/'+testName2[0];
           if (!fs.existsSync(dir2)){
             console.log('Создаем папку')
                fs.mkdirSync(dir2);
            }
           var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1] );
           request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[1], "rejectUnauthorized": false})
               .on('response', function(response) {

               if (response.statusCode === 200) {
                 console.log("DONE");
                 response.pipe(file2);
               } else {
                 console.log("FAIL");
               }
            });
           var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1]);

           //3
           var testName3 = results_tovar[i].image[2].split('/');
           var dir3 = 'publick/data/tovar/'+testName3[0];
           if (!fs.existsSync(dir3)){
             console.log('Создаем папку')
                fs.mkdirSync(dir3);
            }
           var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1] );
           request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[2], "rejectUnauthorized": false})
               .on('response', function(response) {
               if (response.statusCode === 200) {
                 console.log("DONE");
                 response.pipe(file3);
               } else {
                 console.log("FAIL");
               }
            });
           var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1]);

           //4
           var testName4 = results_tovar[i].image[3].split('/');
           var dir4 = 'publick/data/tovar/'+testName4[0];
           if (!fs.existsSync(dir4)){
             console.log('Создаем папку')
                fs.mkdirSync(dir4);
            }
           var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1] );
           request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[3], "rejectUnauthorized": false})
               .on('response', function(response) {
               if (response.statusCode === 200) {
                 console.log("DONE");
                 response.pipe(file4);
               } else {
                 console.log("FAIL");
               }
            });
           var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1]);
         // } catch (e) {
         //   console.log('error: ' + results_tovar[i].title)
         // }
       }


       if(results_tovar[i].image.length === 5){
         //1
         var testName = results_tovar[i].image[0].split('/');
         var dir = 'publick/data/tovar/'+testName[0];
         if (!fs.existsSync(dir)){
           console.log('Создаем папку')
              fs.mkdirSync(dir);
          }
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file);
             } else {
               console.log("FAIL");
             }
          });
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);

         //2
         var testName2 = results_tovar[i].image[1].split('/');
         var dir2 = 'publick/data/tovar/'+testName2[0];
         if (!fs.existsSync(dir2)){
           console.log('Создаем папку')
              fs.mkdirSync(dir2);
          }
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[1], "rejectUnauthorized": false})
             .on('response', function(response) {

             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file2);
             } else {
               console.log("FAIL");
             }
          });
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1]);

         //3
         var testName3 = results_tovar[i].image[2].split('/');
         var dir3 = 'publick/data/tovar/'+testName3[0];
         if (!fs.existsSync(dir3)){
           console.log('Создаем папку')
              fs.mkdirSync(dir3);
          }
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[2], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file3);
             } else {
               console.log("FAIL");
             }
          });
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1]);

         //4
         var testName4 = results_tovar[i].image[3].split('/');
         var dir4 = 'publick/data/tovar/'+testName4[0];
         if (!fs.existsSync(dir4)){
           console.log('Создаем папку')
              fs.mkdirSync(dir4);
          }
         var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[3], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file4);
             } else {
               console.log("FAIL");
             }
          });
         var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1]);

         //5
         var testName5 = results_tovar[i].image[4].split('/');
         var dir5 = 'publick/data/tovar/'+testName5[0];
         if (!fs.existsSync(dir5)){
           console.log('Создаем папку')
              fs.mkdirSync(dir5);
          }
         var file5 = fs.createWriteStream('publick/data/tovar/'+testName5[0]+'/'+testName5[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[4], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file5);
             } else {
               console.log("FAIL");
             }
          });
         var file5 = fs.createWriteStream('publick/data/tovar/'+testName5[0]+'/'+testName5[1]);
       }


       if(results_tovar[i].image.length === 6){
         //1
         var testName = results_tovar[i].image[0].split('/');
         var dir = 'publick/data/tovar/'+testName[0];
         if (!fs.existsSync(dir)){
           console.log('Создаем папку')
              fs.mkdirSync(dir);
          }
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[0], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file);
             } else {
               console.log("FAIL");
             }
          });
         var file = fs.createWriteStream('publick/data/tovar/'+testName[0]+'/'+testName[1]);

         //2
         var testName2 = results_tovar[i].image[1].split('/');
         var dir2 = 'publick/data/tovar/'+testName2[0];
         if (!fs.existsSync(dir2)){
           console.log('Создаем папку')
              fs.mkdirSync(dir2);
          }
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[1], "rejectUnauthorized": false})
             .on('response', function(response) {

             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file2);
             } else {
               console.log("FAIL");
             }
          });
         var file2 = fs.createWriteStream('publick/data/tovar/'+testName2[0]+'/'+testName2[1]);

         //3
         var testName3 = results_tovar[i].image[2].split('/');
         var dir3 = 'publick/data/tovar/'+testName3[0];
         if (!fs.existsSync(dir3)){
           console.log('Создаем папку')
              fs.mkdirSync(dir3);
          }
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[2], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file3);
             } else {
               console.log("FAIL");
             }
          });
         var file3 = fs.createWriteStream('publick/data/tovar/'+testName3[0]+'/'+testName3[1]);

         //4
         var testName4 = results_tovar[i].image[3].split('/');
         var dir4 = 'publick/data/tovar/'+testName4[0];
         if (!fs.existsSync(dir4)){
           console.log('Создаем папку')
              fs.mkdirSync(dir4);
          }
         var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[3], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file4);
             } else {
               console.log("FAIL");
             }
          });
         var file4 = fs.createWriteStream('publick/data/tovar/'+testName4[0]+'/'+testName4[1]);

         //5
         var testName5 = results_tovar[i].image[4].split('/');
         var dir5 = 'publick/data/tovar/'+testName5[0];
         if (!fs.existsSync(dir5)){
           console.log('Создаем папку')
              fs.mkdirSync(dir5);
          }
         var file5 = fs.createWriteStream('publick/data/tovar/'+testName5[0]+'/'+testName5[1] );
         request.get({url:'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[4], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file5);
             } else {
               console.log("FAIL");
             }
          });
         var file5 = fs.createWriteStream('publick/data/tovar/'+testName5[0]+'/'+testName5[1]);



         //6
         var testName6 = results_tovar[i].image[5].split('/');
         var dir6 = 'publick/data/tovar/'+testName6[0];
         if (!fs.existsSync(dir6)){
           console.log('Создаем папку')
              fs.mkdirSync(dir6);
          }
         var file6 = fs.createWriteStream('publick/data/tovar/'+testName6[0]+'/'+testName6[1] );
         request.get({url: 'https://berezkashop.in.ua/assets/images/items/'+ results_tovar[i].image[5], "rejectUnauthorized": false})
             .on('response', function(response) {
             if (response.statusCode === 200) {
               console.log("DONE");
               response.pipe(file6);
             } else {
               console.log("FAIL");
             }
          });
         var file6 = fs.createWriteStream('publick/data/tovar/'+testName6[0]+'/'+testName6[1]);
       }

       console.log(i);
       i = i +1;
     }, 800);
     });

   });
