import predictClassification from '../services/inferenceService.js';
import crypto from 'crypto';
import { storeData, predictionsCollection } from '../services/dataService.js';

async function postPredict(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }
  await storeData(id, data);
  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });
  response.code(201);
  return response;
}

async function getPredictHistories(request, h) {
  const histories = (await predictionsCollection.get()).docs.map((doc) =>
    doc.data()
  );
  const data = histories.map((item) => ({
    id: item.id,
    history: item,
  }));
  return h.response({ status: 'success', data }).code(200);
}

export default { postPredict, getPredictHistories };