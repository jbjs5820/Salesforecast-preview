from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import pandas as pd
from sklearn.model_selection import train_test_split
import io
import cgi

class ModelHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        if self.path == '/analyze':
            content_type = self.headers.get('Content-Type')
            if content_type and 'multipart/form-data' in content_type:
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )
                
                if 'file' in form:
                    fileitem = form['file']
                    if fileitem.file:
                        # Read CSV data
                        csv_data = fileitem.file.read().decode('utf-8')
                        df = pd.read_csv(io.StringIO(csv_data))
                        
                        # Validate required columns
                        if 'ds' not in df.columns or 'y' not in df.columns:
                            self.send_error(400, 'CSV must contain "ds" and "y" columns')
                            return

                        # Convert dates
                        df['ds'] = pd.to_datetime(df['ds'])
                        
                        # Split data 70/30
                        train_df, test_df = train_test_split(df, test_size=0.3, shuffle=False)
                        
                        # Basic statistics
                        stats = {
                            'total_records': len(df),
                            'training_records': len(train_df),
                            'testing_records': len(test_df),
                            'date_range': {
                                'start': df['ds'].min().strftime('%Y-%m-%d'),
                                'end': df['ds'].max().strftime('%Y-%m-%d')
                            },
                            'preview': train_df.head(5).to_dict('records'),
                            'basic_stats': {
                                'mean': float(df['y'].mean()),
                                'std': float(df['y'].std()),
                                'min': float(df['y'].min()),
                                'max': float(df['y'].max())
                            }
                        }
                        
                        self._set_headers()
                        self.wfile.write(json.dumps(stats).encode())
                        return

            self.send_error(400, 'Invalid request')

def run(server_class=HTTPServer, handler_class=ModelHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()