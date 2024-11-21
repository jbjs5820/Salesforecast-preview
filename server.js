import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs/promises';
import Papa from 'papaparse';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import db from './src/server/db.js';
import { validateCSV } from './src/server/validation.js';
import { splitData, trainModel } from './src/server/model.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
try {
  await fs.mkdir('uploads', { recursive: true });
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating uploads directory:', err);
    process.exit(1);
  }
}

app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = await fs.readFile(req.file.path, 'utf-8');
    const { data } = Papa.parse(fileContent, { header: true });

    // Validate CSV format
    const validation = validateCSV(data);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Split data and train model
    const { train, test } = splitData(data);
    const model = trainModel(train);

    // Generate predictions
    const testDates = test.map(d => moment(d.ds).valueOf());
    const predictions = testDates.map(date => model.predict(date));

    // Save model and data
    const modelId = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO models (id, name, train_data, test_data, model_params)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      modelId,
      req.file.originalname,
      JSON.stringify(train),
      JSON.stringify(test),
      JSON.stringify(model.toJSON())
    );

    // Prepare response
    const response = {
      modelId,
      totalRecords: data.length,
      trainRecords: train.length,
      testRecords: test.length,
      dateRange: {
        start: moment(data[0].ds).format('YYYY-MM-DD'),
        end: moment(data[data.length - 1].ds).format('YYYY-MM-DD')
      },
      preview: {
        dates: test.map(d => moment(d.ds).format('YYYY-MM-DD')),
        actual: test.map(d => parseFloat(d.y)),
        predicted: predictions,
        lower_bound: predictions.map(p => p * 0.9),
        upper_bound: predictions.map(p => p * 1.1)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  } finally {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
  }
});

app.get('/api/models', (req, res) => {
  try {
    const models = db.prepare('SELECT id, name, created_at FROM models ORDER BY created_at DESC').all();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.get('/api/models/:id', (req, res) => {
  try {
    const model = db.prepare('SELECT * FROM models WHERE id = ?').get(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});