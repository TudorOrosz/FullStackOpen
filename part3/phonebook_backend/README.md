## Starting dev mode:
Run: 'node --watch index.js'
This will launch the whole application on http://localhost:3001/ . Everything is linked to it, database, API calls, and frontend from the dist file.

## Deploying to web:
Link to Production version of application, deployed on render: https://fullstackopen-xq5q.onrender.com/
To deploy app to render, run: 'npm run deploy:full'

## Bringing changes from frontend folder to backend folder by copying dist file
If you made changes to frontend folder and want to bring them to backend to test full functionality of the app:
run: 'npm run build:ui' and then open the app: 'node --watch index.js'