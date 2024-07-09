const mongoose = require('mongoose');
/* eslint-disable no-param-reassign */

/**
 * Return number of ref arrays in schema
 * @param {ObjectId} schemaId
 * @returns {number}
 */
const getSchemaNumOfRefArrays = async (schema, schemaId, refArray) => {
  try {
    refArray = `$${refArray}`;
    const result = await schema.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(schemaId) } },
      { $project: { numOfRefArrays: { $size: `${refArray}` } } },
    ]);

    if (result.length > 0) {
      const { numOfRefArrays } = result[0];
      return numOfRefArrays;
    }
    return null; // or throw an error, depending on your application's logic
  } catch (error) {
    return null; // or throw an error, depending on your application's logic
  }
};

/**
 * Return pagination ref arrays in schema
 * @param {ObjectId} schemaId
 * @param {string} options
 * @returns {Promise<QueryResult>}
 */
const paginateRefArrays = async (schema) => {
  schema.statics.paginateRefArrays = async function (schemaId, refArray, options) {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = getSchemaNumOfRefArrays(this, schemaId, refArray);

    let docsPromise = this.findById(schemaId).populate({
      path: refArray,
      options: {
        sort,
        skip,
        limit,
      },
    });
    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginateRefArrays;
