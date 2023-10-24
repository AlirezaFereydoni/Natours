const sort = (query, items) => {
  if (query.sort) {
    const sortBy = query.sort.split(',').join(' ');

    items.sort(sortBy);
  } else {
    items.sort('-createdAt');
  }

  return items;
};

const paginator = (query, items) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  return items.skip(skip).limit(limit);
};

const filters = (
  query,
  model,
  excludedQueries = ['page', 'sort', 'limit', 'fields'],
) => {
  const queries = { ...query };
  excludedQueries.forEach((el) => delete queries[el]);
  let queryStr = JSON.stringify(queries);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  return model.find(JSON.parse(queryStr));
};

module.exports = { filters, sort, paginator };
