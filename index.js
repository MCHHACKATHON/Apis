// const admin = require('firebase-admin');

// const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mch-app-3b8de-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const user = req.body;
  const userRef = db.collection('Users');

  userRef.add(user)
    .then((docRef) => {
      res.status(201).json({
        message: 'User added successfully',
        id: docRef.id
      });
    })
    .catch((error) => {
      console.error('Error adding new user:', error);
      res.status(500).json({
        error: 'Error adding new user'
      });
    });
});

  //Get Service
  // app.get('/documents', async (req, res) => {
  //    try {
  //    const documentRef = db.collection('Childs');
  //    const query = documentRefn.where('FirstName', '==', 'Anvi')
  //    const snapshot = await query.get().then(snapshot => {

  //    });
  //   //  const documents = [];
  //   //  snapshot.forEach(doc => { 
  //   //  documents.push({ id: doc.id, ...doc.data() });
  //    });
  //    res.status(200).json(documents);

  //   } catch (error) {
  //    console.error(error);
  //    res.status(500).send('Server error');
  //    }
  //   });
  //Completed Vaccine
   app.get('/CompletedVaccine', async (req, res) => 
  { // Get collection data with where clause 
    const collection = admin.firestore().collection('VaccineDetails'); 
    const currentDate = new Date();
    const query = collection.where('ScheduledOn', '!=', ' ').where('Date', '!=', ' '); 
    const result = await query.get().then(snapshot => { 
      return snapshot.docs.map(doc => doc.data());
     }); 
     
     res.json(result); });


  //Due Vaccine
  app.get('/DueVaccine', async (req, res) => 
  { // Get collection data with where clause 
    const collection = admin.firestore().collection('VaccineDetails'); 
    const currentDate = new Date();
    const query = collection.where('ScheduledOn', '<=', new Date( '2023-03-17' ) ).where('Date', '=', null); 
    const result = await query.get().then(snapshot => { 
      return snapshot.docs.map(doc => doc.data());
     }); 

     



     res.json(result); });

     //Vaccine Taken
     app.get('/VaccineTaken', async (req, res) => {
      try {
          const collection1Ref = db.collection('VaccineDetails');
          const collection2Ref = db.collection('Childs');
  
          const snapshot1 = await collection1Ref.get();
  
          const result = [];
          for (const doc1 of snapshot1.docs) {
              const data1 = doc1.data();
              if (data1.ScheduledOn) 
              {
                if(data1.Date)
                {
              const snapshot2 = await collection2Ref.where('ChildId', '==', data1.patientID).get();
  
              for (const doc2 of snapshot2.docs) {
                  const data2 = doc2.data();
  
                  const combinedData = {
                      ...data1,
                      ...data2
                  };
                  result.push(combinedData);
              }
            }
            }
          }
          res.status(200).json(result);
      } catch (error) {
          console.error(error);
          res.status(500).send('Server error');
      }
  });


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
