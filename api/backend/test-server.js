// Test simple pour vérifier que Node.js fonctionne
console.log('Node.js fonctionne !');
console.log('Version:', process.version);
console.log('Répertoire:', process.cwd());

// Test d'import des modules
try {
  const express = require('express');
  console.log('Express chargé avec succès');
  
  const app = express();
  app.get('/test', (req, res) => {
    res.json({ message: 'Backend fonctionne !' });
  });
  
  app.listen(4000, () => {
    console.log('Serveur démarré sur http://localhost:4000');
  });
  
} catch (error) {
  console.error('Erreur:', error.message);
}
