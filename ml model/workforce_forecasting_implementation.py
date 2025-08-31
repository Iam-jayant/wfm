
"""Workforce Demand Forecasting with Mappls Location Intelligence
Complete Implementation Code
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
import json
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

class MapplsLocationIntelligence:
    '''
    Mappls API integration class for location intelligence
    Replace simulation with actual API calls in production
    '''

    def __init__(self, api_key: str = "your_mappls_api_key"):
        self.api_key = api_key
        self.base_url = "https://apis.mappls.com"

    def get_nearby_businesses(self, lat: float, lon: float, radius: int = 5000):
        '''
        Get nearby business density using Mappls Nearby Search API
        Production endpoint: GET {base_url}/advancedmaps/v1/{api_key}/nearby
        '''
        # Replace with actual API call
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        # Example API call (uncomment for production):
        # response = requests.get(f"{self.base_url}/advancedmaps/v1/{self.api_key}/nearby",
        #                        params={'lat': lat, 'lon': lon, 'radius': radius},
        #                        headers=headers)
        # return response.json()

        # Simulation for demo
        business_density = {
            (28.6139, 77.2090): 450,  # Delhi
            (19.0760, 72.8777): 520,  # Mumbai
            (13.0827, 80.2707): 380,  # Chennai
        }

        density = 300  # default
        for coords, dens in business_density.items():
            if abs(lat - coords[0]) < 0.1 and abs(lon - coords[1]) < 0.1:
                density = dens
                break

        return {
            "business_count": density + np.random.randint(-50, 50),
            "categories": ["retail", "healthcare", "education", "hospitality", "logistics"],
            "peak_hours": "09:00-18:00"
        }

    def get_traffic_analytics(self, lat: float, lon: float):
        '''
        Get traffic data using Mappls Traffic Analytics API
        Production endpoint: GET {base_url}/advancedmaps/v1/{api_key}/traffic
        '''
        # Replace with actual API call in production
        base_traffic = np.random.uniform(0.3, 0.9)
        return {
            "traffic_density": base_traffic,
            "congestion_level": "high" if base_traffic > 0.7 else "medium" if base_traffic > 0.4 else "low",
            "avg_speed_kmph": int(40 * (1 - base_traffic) + 10)
        }

    def get_demographic_data(self, lat: float, lon: float):
        '''Get demographic data for location'''
        city_demographics = {
            (28.6139, 77.2090): {"population_density": 11320, "avg_income": 45000, "employment_rate": 0.68},
            (19.0760, 72.8777): {"population_density": 20694, "avg_income": 52000, "employment_rate": 0.72},
            (13.0827, 80.2707): {"population_density": 26903, "avg_income": 38000, "employment_rate": 0.65},
        }

        demo = {"population_density": 8000, "avg_income": 40000, "employment_rate": 0.65}
        for coords, data in city_demographics.items():
            if abs(lat - coords[0]) < 0.1 and abs(lon - coords[1]) < 0.1:
                demo = data
                break
        return demo

def haversine_distance(lat1, lon1, lat2, lon2):
    '''Calculate distance between two geographic points'''
    from math import radians, cos, sin, asin, sqrt
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Earth radius in kilometers
    return c * r

def create_workforce_dataset(start_date='2022-01-01', end_date='2024-12-31'):
    '''Create comprehensive workforce demand dataset'''

    dates = pd.date_range(start=start_date, end=end_date, freq='D')

    # Define geographical locations (Indian cities)
    locations = [
        {'location_id': 'LOC_001', 'latitude': 28.6139, 'longitude': 77.2090, 'city': 'New Delhi', 'region': 'North'},
        {'location_id': 'LOC_002', 'latitude': 19.0760, 'longitude': 72.8777, 'city': 'Mumbai', 'region': 'West'},
        {'location_id': 'LOC_003', 'latitude': 13.0827, 'longitude': 80.2707, 'city': 'Chennai', 'region': 'South'},
        {'location_id': 'LOC_004', 'latitude': 22.5726, 'longitude': 88.3639, 'city': 'Kolkata', 'region': 'East'},
        {'location_id': 'LOC_005', 'latitude': 12.9716, 'longitude': 77.5946, 'city': 'Bangalore', 'region': 'South'},
    ]

    data = []
    mappls_client = MapplsLocationIntelligence()

    for location in locations:
        for date in dates:
            # Base demand calculation with multiple factors
            base_demand = {'New Delhi': 25, 'Mumbai': 30, 'Chennai': 20, 'Kolkata': 18, 'Bangalore': 22}[location['city']]

            # Seasonal, weekend, and holiday effects
            seasonal_mult = 1.3 if date.month in [11,12,1] else 1.1 if date.month in [4,5,6] else 0.8
            weekend_mult = 0.7 if date.dayofweek >= 5 else 1.0
            holiday_mult = 1.5 if date.day in [1,15,26] else 1.0

            # Regional and temporal trends
            regional_mult = {'North': 1.1, 'West': 1.2, 'South': 1.0, 'East': 0.9}[location['region']]
            year_trend = (date.year - 2022) * 0.1
            random_noise = np.random.normal(0, 0.2)

            workforce_demand = max(5, round(base_demand * seasonal_mult * weekend_mult * 
                                          holiday_mult * regional_mult * (1 + year_trend) * 
                                          (1 + random_noise)))

            # Get Mappls location intelligence
            lat, lon = location['latitude'], location['longitude']
            nearby = mappls_client.get_nearby_businesses(lat, lon)
            traffic = mappls_client.get_traffic_analytics(lat, lon)
            demo = mappls_client.get_demographic_data(lat, lon)

            # Create record
            record = {
                'date': date,
                'location_id': location['location_id'],
                'latitude': lat,
                'longitude': lon,
                'city': location['city'],
                'region': location['region'],
                'workforce_demand': workforce_demand,

                # Temporal features
                'year': date.year, 'month': date.month, 'day': date.day,
                'day_of_week': date.dayofweek, 'is_weekend': int(date.dayofweek >= 5),
                'is_holiday': int(holiday_mult > 1.0), 'quarter': (date.month - 1) // 3 + 1,
                'week_of_year': date.isocalendar()[1],
                'days_from_start': (date - pd.to_datetime(start_date)).days,

                # Weather & economic
                'temperature': 25 + np.random.normal(0, 5),
                'gdp_growth': 0.06 + np.random.normal(0, 0.01),
                'inflation_rate': 0.04 + np.random.normal(0, 0.005),

                # Mappls location intelligence
                'business_count': nearby['business_count'],
                'traffic_density': traffic['traffic_density'],
                'avg_speed_kmph': traffic['avg_speed_kmph'],
                'population_density': demo['population_density'],
                'avg_income': demo['avg_income'],
                'employment_rate': demo['employment_rate'],
            }
            data.append(record)

    df = pd.DataFrame(data)

    # Add derived features
    df['distance_from_delhi'] = df.apply(lambda row: haversine_distance(row['latitude'], row['longitude'], 28.6139, 77.2090), axis=1)
    df['business_per_1k_population'] = (df['business_count'] / df['population_density'] * 1000).round(2)
    df['economic_activity_index'] = (df['business_count'] * df['employment_rate'] * df['avg_income'] / 100000).round(2)
    df['accessibility_score'] = ((100 - df['avg_speed_kmph']) / 100 * df['traffic_density']).round(3)

    return df

def add_time_series_features(df):
    '''Add lag and rolling features for time series prediction'''
    df = df.sort_values(['location_id', 'date']).reset_index(drop=True)

    # Lag features
    for lag in [1, 7, 30]:
        df[f'demand_lag_{lag}'] = df.groupby('location_id')['workforce_demand'].shift(lag)

    # Rolling averages
    for window in [7, 30, 90]:
        df[f'demand_rolling_{window}'] = df.groupby('location_id')['workforce_demand'].rolling(window=window, min_periods=1).mean().reset_index(drop=True)

    # Economic moving averages
    for col in ['gdp_growth', 'inflation_rate']:
        df[f'{col}_ma_30'] = df.groupby('location_id')[col].rolling(window=30, min_periods=1).mean().reset_index(drop=True)

    # Interaction features
    df['temp_season_interaction'] = df['temperature'] * df['month']

    return df

def train_workforce_models(df):
    '''Train multiple ML models and return the best one'''

    # Prepare features
    df = add_time_series_features(df)
    df_clean = df.dropna().reset_index(drop=True)

    # Encode categorical variables
    le_location = LabelEncoder()
    le_city = LabelEncoder()
    le_region = LabelEncoder()

    df_clean['location_encoded'] = le_location.fit_transform(df_clean['location_id'])
    df_clean['city_encoded'] = le_city.fit_transform(df_clean['city'])
    df_clean['region_encoded'] = le_region.fit_transform(df_clean['region'])

    # Feature selection
    feature_columns = [
        'year', 'month', 'day', 'day_of_week', 'quarter', 'week_of_year', 'days_from_start',
        'is_weekend', 'is_holiday', 'temperature', 'gdp_growth', 'inflation_rate',
        'demand_lag_1', 'demand_lag_7', 'demand_lag_30',
        'demand_rolling_7', 'demand_rolling_30', 'demand_rolling_90',
        'gdp_growth_ma_30', 'inflation_rate_ma_30', 'distance_from_delhi',
        'temp_season_interaction', 'business_count', 'traffic_density', 'avg_speed_kmph',
        'population_density', 'avg_income', 'employment_rate',
        'business_per_1k_population', 'economic_activity_index', 'accessibility_score',
        'location_encoded', 'city_encoded', 'region_encoded'
    ]

    X = df_clean[feature_columns]
    y = df_clean['workforce_demand']

    # Time-based split
    split_date = pd.to_datetime('2024-07-01')
    train_mask = df_clean['date'] < split_date
    test_mask = df_clean['date'] >= split_date

    X_train, X_test = X[train_mask], X[test_mask]
    y_train, y_test = y[train_mask], y[test_mask]

    # Models
    models = {
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'Linear Regression': LinearRegression(),
    }

    results = {}
    scaler = StandardScaler()

    # Train models
    for name, model in models.items():
        if name == 'Linear Regression':
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)

        # Metrics
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

        results[name] = {
            'model': model, 'rmse': rmse, 'mae': mae, 'r2': r2, 'mape': mape
        }

    # Best model
    best_name = min(results.keys(), key=lambda x: results[x]['rmse'])

    return results[best_name]['model'], scaler, feature_columns, results, df_clean

def predict_future_demand(model, scaler, location_id, target_date, df_history, feature_columns):
    '''Predict workforce demand for specific location and date'''

    mappls_client = MapplsLocationIntelligence()

    if isinstance(target_date, str):
        target_date = pd.to_datetime(target_date)

    # Get location info
    location_info = df_history[df_history['location_id'] == location_id].iloc[0]
    lat, lon = location_info['latitude'], location_info['longitude']

    # Feature engineering for future date
    future_data = {
        'year': target_date.year, 'month': target_date.month, 'day': target_date.day,
        'day_of_week': target_date.dayofweek, 'quarter': (target_date.month - 1) // 3 + 1,
        'week_of_year': target_date.isocalendar()[1],
        'days_from_start': (target_date - df_history['date'].min()).days,
        'is_weekend': int(target_date.dayofweek >= 5),
        'is_holiday': int(target_date.day in [1, 15, 26]),
        'temperature': 25 + np.random.normal(0, 3),
        'gdp_growth': 0.06, 'inflation_rate': 0.04,
    }

    # Historical features
    recent_data = df_history[(df_history['location_id'] == location_id) & 
                           (df_history['date'] >= target_date - pd.Timedelta(days=90))].sort_values('date')

    if len(recent_data) >= 7:
        future_data.update({
            'demand_lag_1': recent_data['workforce_demand'].iloc[-1],
            'demand_lag_7': recent_data['workforce_demand'].iloc[-7] if len(recent_data) >= 7 else recent_data['workforce_demand'].iloc[-1],
            'demand_lag_30': recent_data['workforce_demand'].iloc[-30] if len(recent_data) >= 30 else recent_data['workforce_demand'].mean(),
            'demand_rolling_7': recent_data['workforce_demand'].tail(7).mean(),
            'demand_rolling_30': recent_data['workforce_demand'].tail(30).mean(),
            'demand_rolling_90': recent_data['workforce_demand'].tail(90).mean(),
        })
    else:
        avg_demand = df_history[df_history['location_id'] == location_id]['workforce_demand'].mean()
        future_data.update({
            'demand_lag_1': avg_demand, 'demand_lag_7': avg_demand, 'demand_lag_30': avg_demand,
            'demand_rolling_7': avg_demand, 'demand_rolling_30': avg_demand, 'demand_rolling_90': avg_demand,
        })

    future_data['gdp_growth_ma_30'] = 0.06
    future_data['inflation_rate_ma_30'] = 0.04

    # Location features
    future_data['distance_from_delhi'] = location_info['distance_from_delhi']
    future_data['temp_season_interaction'] = future_data['temperature'] * future_data['month']

    # Real-time Mappls data
    nearby = mappls_client.get_nearby_businesses(lat, lon)
    traffic = mappls_client.get_traffic_analytics(lat, lon)
    demo = mappls_client.get_demographic_data(lat, lon)

    future_data.update({
        'business_count': nearby['business_count'],
        'traffic_density': traffic['traffic_density'],
        'avg_speed_kmph': traffic['avg_speed_kmph'],
        'population_density': demo['population_density'],
        'avg_income': demo['avg_income'],
        'employment_rate': demo['employment_rate'],
        'business_per_1k_population': nearby['business_count'] / demo['population_density'] * 1000,
        'economic_activity_index': nearby['business_count'] * demo['employment_rate'] * demo['avg_income'] / 100000,
        'accessibility_score': (100 - traffic['avg_speed_kmph']) / 100 * traffic['traffic_density'],
        'location_encoded': location_info['location_encoded'],
        'city_encoded': location_info['city_encoded'],
        'region_encoded': location_info['region_encoded'],
    })

    # Predict
    feature_vector = np.array([[future_data[col] for col in feature_columns]])
    prediction = model.predict(feature_vector)[0]

    return max(5, round(prediction))

# Main execution
if __name__ == "__main__":
    print("Creating workforce demand dataset with Mappls integration...")
    df = create_workforce_dataset()

    print("Training machine learning models...")
    best_model, scaler, features, results, df_clean = train_workforce_models(df)

    print("Making future predictions...")
    locations = ['LOC_001', 'LOC_002', 'LOC_005']
    predictions = []

    for loc in locations:
        for months_ahead in [1, 3, 6]:
            future_date = pd.to_datetime('2025-01-01') + pd.Timedelta(days=months_ahead*30)
            demand = predict_future_demand(best_model, scaler, loc, future_date, df_clean, features)

            city = df_clean[df_clean['location_id'] == loc]['city'].iloc[0]
            predictions.append({
                'location': loc, 'city': city, 'date': future_date.strftime('%Y-%m-%d'),
                'months_ahead': months_ahead, 'predicted_demand': demand
            })

    predictions_df = pd.DataFrame(predictions)

    print("\nWORKFORCE DEMAND PREDICTIONS:")
    for _, row in predictions_df.iterrows():
        print(f"{row['city']}: {row['date']} ({row['months_ahead']} months) = {row['predicted_demand']} workers")

    # Save results
    df_clean.to_csv('workforce_demand_dataset.csv', index=False)
    predictions_df.to_csv('workforce_predictions.csv', index=False)

    print("\nFiles saved: workforce_demand_dataset.csv, workforce_predictions.csv")
    print("Implementation complete!")
