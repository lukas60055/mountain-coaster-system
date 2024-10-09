import fs from 'fs';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';
const jsonFilePath = path.join(
  __dirname,
  `../../data/${environment}/coasters.json`
);

export const readJsonFile = () => {
  if (fs.existsSync(jsonFilePath)) {
    return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  }
  return {};
};

export const writeToJsonFile = (data: Record<string, any>) => {
  const dirPath = path.dirname(jsonFilePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, '{}', 'utf-8');
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
};
