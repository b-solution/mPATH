const { db } = require("../database/models");

const update = async (req, res) => {
  try {
    let sort = null;
    sort = await db.Sort.findOne({ where: { relation: req.body.relation } });
    if (!sort) {
      sort = await db.Sort.create({ relation: req.body.relation, column: req.body.column, order: req.body.order });
    } else {
      sort.set(req.body);
      await sort.save();
    }
    return { sort: await sort.toJSON() };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  update,
};
