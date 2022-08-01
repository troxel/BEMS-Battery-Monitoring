var date = new Date();

Influx = require('influx');

numTrays = 280
schemaLst = {}
schemaLst['volts'] = {}
schemaLst['temperature'] = {}
schemaLst['impedance'] = {}

for (let i = 0; i < numTrays; i++) {
  schemaLst['volts']['v'+i]       = Influx.FieldType.FLOAT
  schemaLst['temperature']['t'+i] = Influx.FieldType.FLOAT
  schemaLst['impedance']['r'+i]   = Influx.FieldType.FLOAT
}

//console.log(schemaLst)

influx = new Influx.InfluxDB({

  host: 'localhost',
  database: 'bems',
  username: 'webdev',
  password: 'bems123',
  schema: [
    {
      measurement: 'volts',
      fields: schemaLst['volts'],
      tags: []
    },
    {
      measurement: 'temperature',
      fields: schemaLst['temperature'],
      tags: []
    },
    {
      measurement: 'impedance',
      fields: schemaLst['impedance'],
      tags: []
    },
  ]
})

fieldsLst = {}
fieldsLst['volts'] = {}
fieldsLst['temperature'] = {}
fieldsLst['impedance'] = {}

// Generate data.... 
for (let i = 0; i < numTrays; i++) {
  fieldsLst['volts']['v'+i]       = 12 + Math.round(Math.random()*10)/10
  fieldsLst['temperature']['t'+i] = Math.round( (Math.random() * (95-70) + 70) * 10) / 10
  fieldsLst['impedance']['r'+i]   = Math.round( (Math.random() * (3-10) + 3) * 10) / 10
}

//console.log(fieldLst)


// Write data to several measurements with same time tag
influx.writePoints(
  [
    {
      measurement: 'volts',
      fields: fieldsLst['volts']  
    },
    {
      measurement: 'temperature',
      fields: fieldsLst['temperature']  
    },
    {
      measurement: 'impedance',
      fields: fieldsLst['impedance']  
    }
  ]
).then(() => console.log('write point success'))
.catch(console.error);

