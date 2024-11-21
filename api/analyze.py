import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.model_selection import train_test_split
import sys
import json

def analyze_data(csv_path):
    # Read the CSV file
    df = pd.read_csv(csv_path)
    
    # Validate required columns
    if 'ds' not in df.columns or 'y' not in df.columns:
        raise ValueError('CSV must contain "ds" and "y" columns')

    # Convert dates and sort
    df['ds'] = pd.to_datetime(df['ds'])
    df = df.sort_values('ds')

    # Split data 70/30
    train_df, test_df = train_test_split(df, test_size=0.3, shuffle=False)

    # Initialize and fit Prophet model
    model = Prophet(
        weekly_seasonality=True,
        yearly_seasonality=True,
        daily_seasonality=False
    )
    model.fit(train_df)

    # Make predictions on test set
    future = model.make_future_dataframe(periods=len(test_df))
    forecast = model.predict(future)

    # Calculate metrics
    test_predictions = forecast.tail(len(test_df))
    mape = np.mean(np.abs((test_df['y'].values - test_predictions['yhat'].values) / test_df['y'].values)) * 100
    rmse = np.sqrt(np.mean((test_df['y'].values - test_predictions['yhat'].values) ** 2))

    # Get components for analysis
    components = model.predict(pd.DataFrame({'ds': df['ds'].unique()}))
    
    # Weekly pattern
    weekly_pattern = components.groupby(components.ds.dt.day_name())['weekly'].mean()
    
    # Monthly pattern
    monthly_pattern = components.groupby(components.ds.dt.month)['yearly'].mean()

    # Prepare response
    analysis = {
        'total_records': len(df),
        'training_records': len(train_df),
        'testing_records': len(test_df),
        'date_range': {
            'start': df['ds'].min().strftime('%Y-%m-%d'),
            'end': df['ds'].max().strftime('%Y-%m-%d')
        },
        'model_metrics': {
            'mape': float(mape),
            'rmse': float(rmse)
        },
        'seasonality': {
            'weekly': weekly_pattern.to_dict(),
            'monthly': monthly_pattern.to_dict()
        },
        'preview': {
            'dates': forecast['ds'].tail(30).dt.strftime('%Y-%m-%d').tolist(),
            'actual': df['y'].tail(30).tolist(),
            'predicted': forecast['yhat'].tail(30).tolist(),
            'lower_bound': forecast['yhat_lower'].tail(30).tolist(),
            'upper_bound': forecast['yhat_upper'].tail(30).tolist()
        }
    }

    return analysis

if __name__ == '__main__':
    try:
        csv_path = sys.argv[1]
        result = analyze_data(csv_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)