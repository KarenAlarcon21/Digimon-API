const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // Para leer el archivo JSON
const app = express();
const port = 3000;

// Middleware para parsear cuerpos JSON
app.use(bodyParser.json());

// Leer los datos de los Digimons desde el archivo JSON
let digimons = [];

// Cargar los datos desde el archivo JSON al iniciar el servidor
fs.readFile(path.join(__dirname, 'digimons.json'), 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo de Digimons:', err);
    return;
  }
  digimons = JSON.parse(data); // Parsear el JSON y asignarlo a la variable digimons
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


// Ruta para obtener todos los Digimons
app.get('/digimons', (req, res) => {
  res.json(digimons);
});

// Ruta para obtener un Digimon por ID
app.get('/digimons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const digimon = digimons.find(d => d.id === id);
  if (digimon) {
    res.json(digimon);
  } else {
    res.status(404).send('Digimon no encontrado');
  }
});

// Ruta para agregar un nuevo Digimon
app.post('/digimons', (req, res) => {
  const { name, type, level } = req.body;
  const newDigimon = {
    id: digimons.length + 1,
    name,
    type,
    level,
  };
  digimons.push(newDigimon);
  
  // Guardar los datos actualizados en el archivo JSON
  fs.writeFile(path.join(__dirname, 'digimons.json'), JSON.stringify(digimons, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
      return res.status(500).send('Error al guardar el archivo');
    }
    res.status(201).json(newDigimon);
  });
});

// Ruta para actualizar un Digimon por ID
app.put('/digimons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type, level } = req.body;
  const digimonIndex = digimons.findIndex(d => d.id === id);

  if (digimonIndex !== -1) {
    digimons[digimonIndex] = { id, name, type, level };
    
    // Guardar los datos actualizados en el archivo JSON
    fs.writeFile(path.join(__dirname, 'digimons.json'), JSON.stringify(digimons, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err);
        return res.status(500).send('Error al guardar el archivo');
      }
      res.json(digimons[digimonIndex]);
    });
  } else {
    res.status(404).send('Digimon no encontrado');
  }
});

// Ruta para eliminar un Digimon por ID
app.delete('/digimons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const digimonIndex = digimons.findIndex(d => d.id === id);

  if (digimonIndex !== -1) {
    digimons.splice(digimonIndex, 1);

    // Guardar los datos actualizados en el archivo JSON
    fs.writeFile(path.join(__dirname, 'digimons.json'), JSON.stringify(digimons, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err);
        return res.status(500).send('Error al guardar el archivo');
      }
      res.status(204).send();
    });
  } else {
    res.status(404).send('Digimon no encontrado');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
