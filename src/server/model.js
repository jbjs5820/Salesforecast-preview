import moment from 'moment';
import { SimpleLinearRegression } from 'ml-regression';

export function splitData(data, trainRatio = 0.7) {
  const sortedData = data.sort((a, b) => moment(a.ds) - moment(b.ds));
  const splitIndex = Math.floor(data.length * trainRatio);
  
  return {
    train: sortedData.slice(0, splitIndex),
    test: sortedData.slice(splitIndex)
  };
}

export function trainModel(trainData) {
  const x = trainData.map(d => moment(d.ds).valueOf());
  const y = trainData.map(d => parseFloat(d.y));
  const model = new SimpleLinearRegression(x, y);
  
  return model;
}