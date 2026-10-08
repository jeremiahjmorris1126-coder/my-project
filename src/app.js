import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { config } from './config/index.js';

export const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'REST API with Node.js',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/v1/health',
      items: '/api/v1/items'
    }
  });
});

// Mount API v1 routes
app.use('/api/v1', apiRoutes);

// Fallback 404 and global error handlers
app.use(notFoundHandler);
app.use(errorHandler);
