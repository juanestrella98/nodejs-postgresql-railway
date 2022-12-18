const { pool } = require("../db");

const getWorkouts = async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const response = await pool.query("select * from workout order by id");
    res.status(200).json(response.rows);
    return;
  }
  if (Object.keys(req.query) == "mode") {
    const response = await pool.query("select * from workout where mode = $1", [
      req.query.mode,
    ]);
    res.status(200).json(response.rows);
    return;
  }
  if (Object.keys(req.query) == "limit") {
    const response = await pool.query("select * from workout limit $1", [
      req.query.limit,
    ]);
    res.status(200).json(response.rows);
    return;
  }
  if (req.query.mode && req.query.limit) {
    const response = await pool.query(
      "select * from workout where mode = $1 limit $2",
      [req.query.mode, req.query.limit]
    );
    res.status(200).json(response.rows);
    return;
  }
};

const postWorkout = async (req, res) => {
  const { name, mode, equipament, exercises, trainertips } = req.body;

  for (const key in req.body) {
    if (key != "name" && key != "mode" && key != "equipament" && key != "exercises" && key != "trainertips") {
      res.status(400).send({
        status: "failed",
        data: {
          error: "El body que has introducido incluye algo mas de lo que se puede pasar",
        },
      });
      return;
    }
  }

  if (!name || !mode || !equipament || !exercises || !trainertips) {
    res.status(400).send({
      status: "failed",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: name, mode, equipment, exercises, trainerTips",
      },
    });
    return;
  }

  let timeCreatedAt = Date();
  let timeUpdateAT = Date();

  try {
    const response = await pool.query(
      "INSERT into workout (name, mode, equipament, exercises, trainerTips, createdAt, updateAt) values ($1,$2,$3, $4, $5, $6, $7)",
      [
        name,
        mode,
        equipament,
        exercises,
        trainertips,
        timeCreatedAt,
        timeUpdateAT,
      ]
    );

    res.status(200).json({
      message: "ok",
      body: {
        name,
        mode,
        equipament,
        exercises,
        trainertips,
      },
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const response = await pool.query("select * from workout where id = $1", [
      req.params.id,
    ]);
    if ((response.rows.length == 0)) {
      res.status(400).send({
        status: "failed",
        data: {
          error: "No existe el workout con el id introducido",
        },
      });
    } else {
      res.status(200).json(response.rows);
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      data: {
        error: "No introduciste bien el parametro de buscar por id o no existe",
      },
    });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const id = req.params.id;
    const workout = await pool.query("select from workout where id = $1", [id]);
    if (workout.rows.length != 0) {
      const response = await pool.query("delete from workout where id = $1", [
        id,
      ]);
      res.status(200).send({
        status: "OK",
        data: {
          message: "Workout borrado",
        },
      });
    } else {
      res.status(400).send({
        status: "Failed",
        data: {
          error: "Workout no encontrado",
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      data: {
        error: "No introduciste bien el parametro de borrar por id",
      },
    });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const id = req.params.id;

    const { body } = req;

    for (const key in body) {
      if (key != "name" && key != "mode" && key != "equipament" && key != "exercises" && key != "trainertips") {
        res.status(400).send({
          status: "failed",
          data: {
            error: "El body que has introducido incluye algo mas de lo que se puede pasar",
          },
        });
        return;
      }
    }

    //me traigo el workout que quiero modificar
    const workout = await pool.query("select * from workout where id = $1", [
      id,
    ]);
    //aunque se introduzca un numero bien si no existe con mandamos un error 400 y cerramos
    if (workout.rows.length == 0) {
      res.status(400).send({
        status: "failed",
        data: {
          error: "El workout que quieres modificar no existe",
        },
      });
      return;
    }


    //nos creamos un nuevo workout el workout.rows coge el objeto workout del select hecho anteriormente y se pone tambien
    //el body del req que esta parametrizado
    const updateWorkout = {
      ...workout.rows[0],
      ...body,
    };

    //desparametrizo el el workout actualizado para hacer el update
    const { name, mode, equipament, exercises, trainertips } = updateWorkout;

    let timeUpdateAT = Date();
    const response = await pool.query(
      "update workout set name = $1, mode = $2, equipament = $3, exercises = $4, trainertips = $5, updateat = $6 where id = $7",
      [name, mode, equipament, exercises, trainertips, timeUpdateAT, id]
    );

    res.json("workout updated exitosmaente");
  } catch (error) {
    res.status(400).send({
      status: "failed",
      data: {
        error: "No introduciste bien el parametro de actualizar por id",
      },
    });
  }
};
module.exports = {
  getWorkouts,
  getWorkoutById,
  postWorkout,
  deleteWorkout,
  updateWorkout,
};
