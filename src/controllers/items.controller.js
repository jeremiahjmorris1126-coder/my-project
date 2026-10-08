import { itemStore } from '../data/items.js';

export function getItems(req, res) {
  const { search, completed } = req.query;
  const items = itemStore.getAll({ search, completed });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
}

export function getItemById(req, res) {
  const { id } = req.params;
  const item = itemStore.getById(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item with id ${id} not found`
    });
  }

  res.json({
    success: true,
    data: item
  });
}

export function createItem(req, res) {
  const { title, description, completed } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Field "title" is required and must be a non-empty string'
    });
  }

  const newItem = itemStore.create({ title, description, completed });

  res.status(201).json({
    success: true,
    data: newItem
  });
}

export function updateItem(req, res) {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Field "title" must be a non-empty string if provided'
    });
  }

  const updatedItem = itemStore.update(id, { title, description, completed });

  if (!updatedItem) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item with id ${id} not found`
    });
  }

  res.json({
    success: true,
    data: updatedItem
  });
}

export function deleteItem(req, res) {
  const { id } = req.params;
  const deleted = itemStore.delete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item with id ${id} not found`
    });
  }

  res.json({
    success: true,
    message: `Item with id ${id} successfully deleted`
  });
}
