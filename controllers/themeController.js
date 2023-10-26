import Theme from '../models/themeModel.js';
import { createOne, updateOne, getAll, getOne } from './baseController.js';

export const themeCreate = createOne(Theme);
export const themeUpdate = updateOne(Theme);
export const themeGet = getOne(Theme);
