const { db } = require("../database/models");
const { Op } = require("sequelize");
const qs = require("qs");
const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");

// Function for retrieving user details
const index = async (req, res) => {
  try {
    let params = qs.parse(req.params);
    printParams(req);

    let user = await getCurrentUser(req.headers["x-token"]);
    var project = await db.Project.findOne({ where: { id: params.id } });
    var favoriteFilters = await db.FavoriteFilter.findAll({
      where: {
        [Op.or]: {
          user_id: user.id,
          shared: true,
        },
      },
    });
    var response = [];
    for (var favoriteFilter of favoriteFilters) {
      var ff = await favoriteFilter.toJSON();
      response.push(ff);
    }

    res.type("application/json").code(200);
    return response;
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data" + error.stack };
  }
};

const reset = async (req, res) => {
  try {
    // const { getCurrentUser, printParams, compactAndUniq } = require("../utils/helpers.js");
    let body = qs.parse(req.body);
    let params = qs.parse(req.params);
    let query = qs.parse(req.query);
    printParams(req);

    let user = await getCurrentUser(req.headers["x-token"]);
    var project = await db.Project.findOne({ where: { id: params.id } });
    var favoriteFilter = await db.FavoriteFilter.findOne({
      where: { project_id: project.id },
    });
    if (favoriteFilter) {
      console.log("favoriteFilter--", favoriteFilter);
      await db.QueryFilter.destroy({ where: { favorite_filter_id: favoriteFilter.id } });
      await favoriteFilter.destroy();
    }

    // Fetch user profile using req.userId
    res.type("application/json").code(200);
    return { message: "Filters destroyed successfully", id: favoriteFilter.id };
  } catch (error) {
    res.code(500);
    return { error: "Error fetching data" + error.stack };
  }
};
const create = async (req, res) => {
  try {
    const params = req.body.query_filters || [];
    const favParams = req.body.favorite_filter_params;
    const currentUser = await getCurrentUser(req.headers["x-token"]);
    const user = await db.User.findOne({ where: { email: currentUser.email } });
    console.log("user----", user);
    console.log("Params---", params);

    // var favorFilter = await db.FavoriteFilter.findOne({
    //   where: { project_id: req.params.project_id },
    // });
    console.log("FavorFilter---", favParams);
    if (!favParams) {
      return { message: "No filter found" };
    }
    const project = await db.Project.findByPk(req.params.project_id);
    console.log("Project--", project);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    let favoriteFilter = null;
    if (favParams.id) {
      favoriteFilter = await project.getFavoriteFilters({ where: { id: favParams.id } });
      favoriteFilter = favoriteFilter[0];
      if (favoriteFilter && !favoriteFilter.canUpdate(req.user)) {
        throw new Error("You are not authorized to modify filter");
      } else {
        const updated = await favoriteFilter.update(favParams);
        console.log("Updated Filter--", updated);
        if (!updated) {
          return { error: favoriteFilter.errors.join(", ") };
        }
      }
    } else {
      console.log("Create");
      favoriteFilter = db.FavoriteFilter.build({
        project_id: project.id,
        name: favParams.name,
        user_id: user.id,
        shared: favParams.shared,
      });
      console.log("Created FIlter:--", favoriteFilter);
      await favoriteFilter.save();
      if (!favoriteFilter) {
        return { error: favoriteFilter.errors.join(", ") };
      }
    }
    const existingQueryFilters = await db.QueryFilter.findAll({
      where: {
        user_id: user.id,
        favorite_filter_id: favoriteFilter.id,
      },
    });
    const existingQueryFilterKeys = [...new Set(existingQueryFilters.map((f) => f.filter_key))];
    const queryFilters = [];
    const queryFiltersToRemove = [];
    console.log("ExistingQueryFilter--", existingQueryFilters);
    if (existingQueryFilters.length > 0) {
      const existingFilter = existingQueryFilters.find((qf) => qf.filter_key === params.filter_key);
      console.log("existingFilter--", existingFilter);
      if (existingFilter) {
        existingQueryFilterKeys.splice(existingQueryFilterKeys.indexOf(existingFilter.filter_key), 1);
        await existingFilter.update(filter);
      } else {
        queryFilters.push(db.QueryFilter.build({ ...filter, project_id: project.id, user_id: req.user.id, favorite_filter_id: favoriteFilter.id }));
      }
    }
    if (existingQueryFilterKeys.length > 0) {
      await db.QueryFilter.destroy({
        where: {
          filter_key: {
            [Op.in]: existingQueryFilterKeys,
          },
        },
      });
    }
    if (queryFilters.length > 0) {
      await db.QueryFilter.bulkCreate(queryFilters);
    }
    console.log("last---", favoriteFilter);
    return { favorite_filter: await favoriteFilter.toJSON() };
  } catch (error) {
    return { message: error };
  }
};

module.exports = {
  index,
  reset,
  create,
};
