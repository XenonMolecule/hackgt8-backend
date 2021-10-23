import express from 'express';

import APIRoutes from './api';

const MainRouter = express.Router();

MainRouter.use('/api', APIRoutes);

export default MainRouter;
