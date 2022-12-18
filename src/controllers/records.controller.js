
const { v4: uuid } = require("uuid");
const {pool} = require('../db')

const getRecords = async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        const response = await pool.query("select * from records order by id");
        res.status(200).json(response.rows);
        return;
    }
};

const getRecordsByWorkoutId = async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        //select * from records where workout = 5;
        try {
            const response = await pool.query(
                "select * from records where workout = $1",
                [req.params.id]
            );
            //res.status(200).json(response.rows);
            if (response.rows.length == 0) {
                res.status(400).send({
                    status: "failed",
                    data: {
                        error: "No existen records con el workout introducido",
                    },
                });
            } else {
                res.status(200).json(response.rows);
            }
        } catch (error) {
            res.status(500).send({
                status: "failed",
                data: {
                    error:
                        "No introduciste bien el parametro de buscar por id o no existe",
                },
            });
        }
        return;
    }
};

const postRecord = async (req, res) => {
    const { workout, record } = req.body;
    console.log(workout, record);

    for (const key in req.body) {
        if (key != "workout" && key != "record") {
            res.status(400).send({
                status: "failed",
                data: {
                    error: "El body que has introducido incluye algo mas que record y workout",
                },
            });
            return;
        }
    }

    if (!workout || !record) {
        res.status(400).send({
            status: "failed",
            data: {
                error:
                    "One of the following keys is missing or is empty in request body: workout, record",
            },
        });
        return;
    }

    try {
        const id = uuid();
        const response = await pool.query("insert into records values($1,$2,$3)", [
            id,
            workout,
            record,
        ]);

        res.status(200).json({
            message: "ok",
            body: {
                id,
                workout,
                record,
            },
        });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id.toString());
        const workout = await pool.query("select from records where id = $1", [id]);
        console.log(workout);
        if (workout.rows.length != 0) {
            const response = await pool.query("delete from records where id = $1", [
                id,
            ]);
            res.status(200).send({
                status: "OK",
                data: {
                    message: "Record borrado",
                },
            });
        } else {
            res.status(400).send({
                status: "Failed",
                data: {
                    error: "Record no encontrado",
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

const updateRecord = async (req, res) => {
    try {
        const id = req.params.id;

        const { body } = req;

        for (const key in body) {
            if (key != "record") {
                res.status(400).send({
                    status: "failed",
                    data: {
                        error: "El body que has introducido incluye algo mas o distinto que record ",
                    },
                });
                return;
            }
        }

        //me traigo el record que quiero modificar
        const record = await pool.query("select * from records where id = $1", [
            id,
        ]);

        //aunque se introduzca un numero bien si no existe con mandamos un error 400 y cerramos
        if (record.rows.length == 0) {
            res.status(400).send({
                status: "failed",
                data: {
                    error: "El record que quieres modificar no existe",
                },
            });
            return;
        }
        //nos creamos un nuevo member el member.rows coge el objeto member del select hecho anteriormente y se pone tambien
        //el body del req que esta parametrizado
        const updateREcord = {
            ...record.rows[0],
            ...body,
        };

        const response = await pool.query(
            "update records set record = $1 where id = $2",
            [updateREcord.record, id]
        );

        res.status(200).json({
            message: "ok",
            body: updateREcord,
        });
    } catch (error) {
        res.status(500).send({
            status: "failed",
            data: {
                error: "No introduciste bien el parametro de actualizar por id",
            },
        });
    }
};

module.exports = {
    getRecords,
    getRecordsByWorkoutId,
    postRecord,
    deleteRecord,
    updateRecord,
};
