
var admin = require("firebase-admin");
const cors = require('cors');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mch-app-3b8de-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

const express = require('express');

const bodyParser = require('body-parser');

const app = express();
app.use(cors()); 
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


app.get('/MotherDetail', async (req, res) => {

  try {

    const collection1Ref = db.collection('Mother');

    const snapshot1 = await collection1Ref.get();

    const result = [];

    for (const doc1 of snapshot1.docs) {

      const data1 = doc1.data();

      const combinedData = {

        ...data1

      };

      result.push(combinedData);

    }

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).send('Server error');

  }

});



app.get('/ChildDetail', async (req, res) => {

  try {

    const collection1Ref = db.collection('Childs');

    const snapshot1 = await collection1Ref.get();

    const result = [];

    for (const doc1 of snapshot1.docs) {

      const data1 = doc1.data();

      const combinedData = {

        ...data1

      };

      result.push(combinedData);

    }

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).send('Server error');

  }

});

app.post('/MotherAdd', (req, res) => {

  const user = req.body;

  const userRef = db.collection('Mother');

  userRef.add(user)

    .then((docRef) => {

      res.status(201).json({

        message: 'Mother added successfully',

        id: docRef.id

      });

    })

    .catch((error) => {

      console.error('Error adding new Mother:', error);

      res.status(500).json({

        error: 'Error adding new Mother'

      });

    });

});

     //Vaccine Taken
     app.get('/VaccineTaken', async (req, res) => {
      try {
          const collection1Ref = db.collection('VaccineDetails');
          const collection2Ref = db.collection('Childs');
  
          const snapshot1 = await collection1Ref.get();
  
          const result = [];
          for (const doc1 of snapshot1.docs) {
              const data1 = doc1.data();
              if (data1.ScheduledOn) {
                if(data1.Date) {
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

//Parent Vaccine Taken
app.get('/ParentVaccineTaken', async (req, res) => {
  try {
    const collection1Ref = db.collection('VaccineDetails');
    const collection2Ref = db.collection('Mother');

    const snapshot1 = await collection1Ref.get();

    const result = [];
    for (const doc1 of snapshot1.docs) {
      const data1 = doc1.data();
      if (data1.ScheduledOn) {
        if (data1.Date) {
          const snapshot2 = await collection2Ref.where('patientId', '==', data1.patientID).get();

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

   //upcoming Vaccine
   app.get('/UpcomingVaccine', async (req, res) => {
    try {
        const collection1Ref = db.collection('VaccineDetails');
        const collection2Ref = db.collection('Childs');
        
        const snapshot1 = await collection1Ref.get();
        const currentDate = new Date(); 
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
         const formattedDate = currentDate.toLocaleDateString('en-US', options);
         
        const result = [];
        for (const doc1 of snapshot1.docs) {
            const data1 = doc1.data();
            if (data1.ScheduledOn) {
            const ScheduleOn = new Date(data1.ScheduledOn);
          
            const Scheduledate = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formatedSchDate = ScheduleOn.toLocaleDateString('en-US', Scheduledate);
            console.log(formatedSchDate)
            
       
         
            if (formatedSchDate  >= formattedDate ) {
               if(!data1.Date) {
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
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

//Parent Upcomming Vaccine
app.get('/ParentUpcomingVaccine', async (req, res) => {
  try {
    const collection1Ref = db.collection('VaccineDetails');
    const collection2Ref = db.collection('Mother');

    const snapshot1 = await collection1Ref.get();
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    const result = [];
    for (const doc1 of snapshot1.docs) {
      const data1 = doc1.data();
      if (data1.ScheduledOn) {
        const ScheduleOn = new Date(data1.ScheduledOn);

        const Scheduledate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatedSchDate = ScheduleOn.toLocaleDateString('en-US', Scheduledate);
        console.log(formatedSchDate)



        if (formatedSchDate >= formattedDate) {
          if (!data1.Date) {
            const snapshot2 = await collection2Ref.where('patientId', '==', data1.patientID).get();

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
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


 //Due Vaccine
 app.get('/DueVaccine', async (req, res) => {
  try {
      const collection1Ref = db.collection('VaccineDetails');
      const collection2Ref = db.collection('Childs');
      
      const snapshot1 = await collection1Ref.get();
      const currentDate = new Date(); 
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
       const formattedDate = currentDate.toLocaleDateString('en-US', options);
       
      const result = [];
      for (const doc1 of snapshot1.docs) {
          const data1 = doc1.data();
          if (data1.ScheduledOn) {
          const ScheduleOn = new Date(data1.ScheduledOn);
        
          const Scheduledate = { year: 'numeric', month: '2-digit', day: '2-digit' };
          const formatedSchDate = ScheduleOn.toLocaleDateString('en-US', Scheduledate);
          console.log(formatedSchDate)
          
     
       
          if (formatedSchDate  < formattedDate ) {
             if(!data1.Date) {
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
      }
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});


//Parent Due Vaccine
app.get('/ParentDueVaccine', async (req, res) => {
  try {
    const collection1Ref = db.collection('VaccineDetails');
    const collection2Ref = db.collection('Mother');

    const snapshot1 = await collection1Ref.get();
    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    const result = [];
    for (const doc1 of snapshot1.docs) {
      const data1 = doc1.data();
      if (data1.ScheduledOn) {
        const ScheduleOn = new Date(data1.ScheduledOn);

        const Scheduledate = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatedSchDate = ScheduleOn.toLocaleDateString('en-US', Scheduledate);
        console.log(formatedSchDate)



        if (formatedSchDate < formattedDate) {
          if (!data1.Date) {
            const snapshot2 = await collection2Ref.where('patientId', '==', data1.patientID).get();

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
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.get('/ParentChildBar', async (req, res) => {
  try {

    const collection1Ref = db.collection('VaccineDetails');
    const collection2Ref = db.collection('Childs');
    const collection3Ref = db.collection('Mother');

    const [snapshot1, child, mother] = await Promise.all([
      collection1Ref.get(),
      collection2Ref.get(),
      collection3Ref.get()
    ]);
    // const snapshot1 = await collection1Ref.get();
    // const child = await collection2Ref.get();
    // const Mother = await collection3Ref.get();
    const label1 = [];
    const dataset1 = [
      {
        label: "Mother",
        data: [],
        backgroundColor: 'blue'
      },
      {
        label: "Child",
        data: [],
        backgroundColor: 'limegreen'
      }
    ];
    const moth = new Map();
    const chld = new Map();

    for (const doc1 of snapshot1.docs) {
      const data1 = doc1.data();
      // var child = {};
      // const mother = await collection3Ref.where('patientId', '==', data1.patientID).get();
      const motherDoc = mother.docs.find(motherDoc => motherDoc.data().patientId === data1.patientID);

      // if (mother.size < 1){
      //   child = await collection2Ref.where('patientId', '==', data1.patientID).get();
      // }

      if (!motherDoc) {
        const childDoc = child.docs.find(childDoc => childDoc.data().ChildId === data1.patientID);
        if (childDoc) {
          // const data2 = childDoc.data();
          if (chld.has(data1.Vaccine)) {
            chld.set(data1.Vaccine, chld.get(data1.Vaccine) + 1);
          } else {
            chld.set(data1.Vaccine, 1);
          }
        }

      } else {
        // const data2 = motherDoc.data();
        if (moth.has(data1.Vaccine)) {
          moth.set(data1.Vaccine, moth.get(data1.Vaccine) + 1);
        } else {
          moth.set(data1.Vaccine, 1);
        }
      }



      if (!label1.find(label1 => label1 === data1.Vaccine)) {
        label1.push(data1.Vaccine);
      }

      // if(mother.size > 0){
      //   if(moth.get(data1.Vaccine)){
      //     moth.set(data1.Vaccine , moth.get(data1.Vaccine) + 1 );
      //   }else{
      //     moth.set(data1.Vaccine , 1);
      //   }
      // }else if(child.size > 0){
      //   if(chld.get(data1.Vaccine)){
      //     chld.set(data1.Vaccine , chld.get(data1.Vaccine) + 1 );
      //   }else{
      //     chld.set(data1.Vaccine , 1);
      //   }
      // }


    }

    moth.forEach((values, keys) => {
      dataset1[0].data.push(values);
    });

    chld.forEach((values, keys) => {
      dataset1[1].data.push(values);
    });


    // const labels = ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13', '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17'];
    // const datasets = [
    //   {
    //     label: "Sales",
    //     data: ['467', '576', '572', '79', '92', '574', '573', '576'],
    //     backgroundColor: 'blue'
    //   },
    //   {
    //     label: "Profit",
    //     data: ['542', '542', '536', '327', '17',
    //            '0.00', '538', '541'],
    //     backgroundColor: 'limegreen'
    //   }  
    // ];

    const result = {
      labels: label1,
      datasets: dataset1
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



app.listen(3000, () => {
  console.log('Server started on port 3000');
});

