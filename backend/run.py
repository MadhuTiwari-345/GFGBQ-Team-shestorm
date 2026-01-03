import sys
import os

# Add the current directory to the Python path so backend can be imported as a package
sys.path.insert(0, os.path.dirname(__file__))

import uvicorn

if __name__ == "__main__":
    # Import app after setting path
    from app.main import app
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
