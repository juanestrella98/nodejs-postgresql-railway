const { pool } = require("../db");


const getMebers = async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const response = await pool.query("select * from member order by id");
    res.status(200).json(response.rows);
    return;
  }
};

const postmeber = async (req, res) => {
  const { name, genre, birthday, email, phone, height, weigh, password  } = req.body;

  for (const key in req.body) {
    if (key != "name" && key != "genre" && key != "birthday" && key != "email" && key != "phone" && key != "height" && key != "weigh" && key != "password") {
      res.status(400).send({
        status: "failed",
        data: {
          error: "El body que has introducido incluye algo mas de lo que se puede pasar",
        },
      });
      return;
    }
  }

  if (!name || !genre || !birthday || !email || !phone || !height || !weigh || !password) {
    res.status(400).send({
      status: "failed",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: name, genre, birthday, email, phone, height, weigh, password",
      },
    });
    return;
  }

  try {
    const response = await pool.query(
      "insert into member(name, genre, birthday, email, phone, height, weigh, password) values($1,$2,$3, $4, $5, $6, $7, $8)",
      [
        name, genre, birthday, email, phone, height, weigh, password
      ]
    );

    res.status(200).json({
      message: "ok",
      body: {
        name, genre, birthday, email, phone, height, weigh, password
      },
    });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const getMeberById = async (req, res) => {
  try {
    const response = await pool.query("select * from member where id = $1", [
      req.params.id,
    ]);
    if ((response.rows.length == 0)) {
      res.status(400).send({
        status: "failed",
        data: {
          error: "No existe el member con el id introducido",
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

const deleteMember = async (req, res) => {
  try {
    const id = req.params.id;
    const workout = await pool.query("select from member where id = $1", [id]);
    if (workout.rows.length != 0) {
      const response = await pool.query("delete from member where id = $1", [
        id,
      ]);
      res.status(200).send({
        status: "OK",
        data: {
          message: "Member borrado",
        },
      });
    } else {
      res.status(400).send({
        status: "Failed",
        data: {
          error: "Member no encontrado",
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

const updateMember = async (req, res) => {
  try {
    const id = req.params.id;

    const { body } = req;

    for (const key in req.body) {
      if (key != "name" && key != "genre" && key != "birthday" && key != "email" && key != "phone" && key != "height" && key != "weigh" && key != "password") {
        res.status(400).send({
          status: "failed",
          data: {
            error: "El body que has introducido incluye algo mas de lo que se puede pasar",
          },
        });
        return;
      }
    }

    //me traigo el member que quiero modificar
    const member = await pool.query("select * from member where id = $1", [
      id,
    ]);
    //aunque se introduzca un numero bien si no existe con mandamos un error 400 y cerramos
    if (member.rows.length == 0) {
      res.status(400).send({
        status: "failed",
        data: {
          error: "El member que quieres modificar no existe",
        },
      });
      return;
    }
    //nos creamos un nuevo member el member.rows coge el objeto member del select hecho anteriormente y se pone tambien
    //el body del req que esta parametrizado
    const updateMember = {
      ...member.rows[0],
      ...body,
    };

    //desparametrizo el el member actualizado para hacer el update
    console.log(updateMember);
    const {name, genre, birthday, email, phone, height, weigh, password } = updateMember;

    const response = await pool.query(
      "update member set name = $1, genre = $2, birthday = $3, email = $4, phone = $5, height = $6, weigh = $7, password=$8 where id = $9",
      [name, genre, birthday, email, phone, height, weigh, password, id]
    );

    res.json("member updated exitosmaente");
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
    getMebers, postmeber, getMeberById, deleteMember, updateMember
};
