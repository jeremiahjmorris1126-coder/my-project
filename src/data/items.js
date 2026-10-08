let items = [
  {
    id: 1,
    title: 'Set up Node.js REST API',
    description: 'Initialize project structure and configure Express',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Write API unit tests',
    description: 'Ensure all CRUD operations pass validation tests',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Deploy API service',
    description: 'Deploy the application to cloud hosting',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let nextId = 4;

export const itemStore = {
  getAll({ search, completed } = {}) {
    let result = [...items];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    if (completed !== undefined) {
      const isCompleted = completed === 'true' || completed === true;
      result = result.filter(item => item.completed === isCompleted);
    }

    return result;
  },

  getById(id) {
    const numericId = Number(id);
    return items.find(item => item.id === numericId) || null;
  },

  create({ title, description = '', completed = false }) {
    const newItem = {
      id: nextId++,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    return newItem;
  },

  update(id, updates) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) {
      return null;
    }

    const current = items[index];
    const updated = {
      ...current,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.completed !== undefined && { completed: Boolean(updates.completed) }),
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    return updated;
  },

  delete(id) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) {
      return false;
    }
    items.splice(index, 1);
    return true;
  },

  reset() {
    items = [
      {
        id: 1,
        title: 'Set up Node.js REST API',
        description: 'Initialize project structure and configure Express',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Write API unit tests',
        description: 'Ensure all CRUD operations pass validation tests',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Deploy API service',
        description: 'Deploy the application to cloud hosting',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
    nextId = 4;
  }
};
