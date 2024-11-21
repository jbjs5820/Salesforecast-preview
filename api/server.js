import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import Papa from 'papaparse';
import moment from 'moment';
import { SimpleLinearRegression } from 'ml-regression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

function splitTrainTest(data, trainRatio = 0.7) {
  const splitIndex = Math.floor(data.length * trainRatio);
  return {
    train: data.slice(0, splitIndex),
    test: data.slice(splitIndex)
  };
}

function calculateMetrics(actual, predicted) {
  const mape = actual.reduce((sum, val, i) => {
    return sum + Math.abs((val - predicted[i]) / val);
  }, 0) / actual.length * 100;

  const rmse = Math.sqrt(
    actual.reduce((sum, val, i) => {
      return sum + Math.pow(val - predicted[i], 2);
    }, 0) / actual.length
  );

  return { mape, rmse };
}

function analyzeSeasonality(data) {
  const weeklyPattern = {};
  const monthlyPattern = {};

  data.forEach(point => {
    const date = moment(point.ds);
    const dayName = date.format('dddd');
    const month = date.format('MMMM');

    if (!weeklyPattern[dayName]) weeklyPattern[dayName] = [];
    if (!monthlyPattern[month]) monthlyPattern[month] = [];

    weeklyPattern[dayName].push(point.y);
    monthlyPattern[month].push(point.y);
  });

  // Calculate averages
  Object.keys(weeklyPattern).forEach(day => {
    weeklyPattern[day] = weeklyPattern[day].reduce((a, b) => a + b, 0) / weeklyPattern[day].length;
  });

  Object.keys(monthlyPattern).forEach(month => {
    monthlyPattern[month] = monthlyPattern[month].reduce((a, b) => a + b, 0) / monthlyPattern[month].length;
  });

  return { weekly: weeklyPattern, monthly: monthlyPattern };
}

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = await fs.readFile(req.file.path, 'utf-8');
    const { data } = Papa.parse(fileContent, { header: true });

    // Validate required columns
    if (!data[0]?.ds || !data[0]?.y) {
      return res.status(400).json({ error: 'CSV must contain "ds" and "y" columns' });
    }

    // Convert string values to numbers
    const cleanData = data.map(row => ({
      ds: moment(row.ds).valueOf(),
      y: parseFloat(row.y)
    })).filter(row => !isNaN(row.ds) && !isNaN(row.y));

    // Split data
    const { train, test } = splitTrainTest(cleanData);

    // Train simple linear regression
    const regression = new SimpleLinearRegression(
      train.map(p => p.ds),
      train.map(p => p.y)
    );

    // Make predictions
    const predictions = test.map(point => regression.predict(point.ds));
    const metrics = calculateMetrics(test.map(p => p.y), predictions);

    // Analyze seasonality
    const seasonality = analyzeSeasonality(data.map(row => ({
      ds: row.ds,
      y: parseFloat(row.y)
    })));

    // Prepare response
    const analysis = {
      total_records: data.length,
      training_records: train.length,
      testing_records: test.length,
      date_range: {
        start: moment(cleanData[0].ds).format('YYYY-MM-DD'),
        end: moment(cleanData[cleanData.length - 1].ds).format('YYYY-MM-DD')
      },
      model_metrics: {
        mape: metrics.mape,
        rmse: metrics.rmse
      },
      seasonality,
      preview: {
        dates: test.map(p => moment(p.ds).format('YYYY-MM-DD')),
        actual: test.map(p => p.y),
        predicted: predictions,
        lower_bound: predictions.map(p => p * 0.9),
        upper_bound: predictions.map(p => p * 1.1)
      }
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed: ' + error.message });
  } finally {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});